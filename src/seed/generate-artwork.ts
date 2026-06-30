import sharp from 'sharp'

/**
 * Generates abstract gradient-mesh "hero art" tiles in The Games Ocean palette to stand in for
 * real product photography during seeding. Deterministic per seed-key so re-seeding is stable.
 */

const PALETTES: [string, string][] = [
  ['#8b5cf6', '#22d3ee'],
  ['#f0339b', '#8b5cf6'],
  ['#22d3ee', '#10b981'],
  ['#f0339b', '#fb923c'],
  ['#8b5cf6', '#f0339b'],
  ['#10b981', '#22d3ee'],
  ['#fb923c', '#f0339b'],
]

function hashStr(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) >>> 0
  }
  return h
}

function shapeMarkup(variant: number, size: number, hash: number, c1: string, c2: string): string {
  const cx = size / 2
  const cy = size / 2
  const rot = hash % 360

  if (variant === 0) {
    // Concentric rings (console / orbit motif)
    return `
      <g transform="rotate(${rot} ${cx} ${cy})" opacity="0.85">
        <circle cx="${cx}" cy="${cy}" r="${size * 0.22}" fill="none" stroke="url(#ring)" stroke-width="${size * 0.006}" />
        <circle cx="${cx}" cy="${cy}" r="${size * 0.16}" fill="none" stroke="url(#ring)" stroke-width="${size * 0.004}" opacity="0.6" />
        <circle cx="${cx}" cy="${cy}" r="${size * 0.30}" fill="none" stroke="url(#ring)" stroke-width="${size * 0.0025}" opacity="0.35" />
      </g>
      ${dots(size, hash, c1, c2)}
    `
  }

  if (variant === 1) {
    // Hexagonal "chip" motif
    const r = size * 0.2
    const pts = Array.from({ length: 6 })
      .map((_, i) => {
        const a = (Math.PI / 3) * i - Math.PI / 2
        return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`
      })
      .join(' ')
    const r2 = size * 0.13
    const pts2 = Array.from({ length: 6 })
      .map((_, i) => {
        const a = (Math.PI / 3) * i - Math.PI / 2
        return `${cx + r2 * Math.cos(a)},${cy + r2 * Math.sin(a)}`
      })
      .join(' ')
    return `
      <g transform="rotate(${rot % 60} ${cx} ${cy})" opacity="0.9">
        <polygon points="${pts}" fill="none" stroke="url(#ring)" stroke-width="${size * 0.005}" />
        <polygon points="${pts2}" fill="none" stroke="url(#ring)" stroke-width="${size * 0.0035}" opacity="0.55" />
      </g>
      ${dots(size, hash, c1, c2)}
    `
  }

  // Faceted gem / prism motif
  const w = size * 0.34
  const h = size * 0.4
  const top = cy - h / 2
  const bottom = cy + h / 2
  return `
    <g transform="rotate(${rot % 40} ${cx} ${cy})" opacity="0.85">
      <path d="M ${cx - w / 2} ${cy} L ${cx} ${top} L ${cx + w / 2} ${cy} L ${cx} ${bottom} Z"
            fill="none" stroke="url(#ring)" stroke-width="${size * 0.005}" />
      <path d="M ${cx - w / 2} ${cy} L ${cx + w / 2} ${cy}" stroke="url(#ring)" stroke-width="${size * 0.0028}" opacity="0.55" />
      <path d="M ${cx} ${top} L ${cx} ${bottom}" stroke="url(#ring)" stroke-width="${size * 0.0028}" opacity="0.4" />
    </g>
    ${dots(size, hash, c1, c2)}
  `
}

function dots(size: number, hash: number, c1: string, c2: string): string {
  let out = ''
  for (let i = 0; i < 10; i++) {
    const seed = (hash >> (i * 2)) & 0xff
    const x = (seed * 37) % size
    const y = ((seed * 53) + i * 97) % size
    const r = 2 + (seed % 5)
    out += `<circle cx="${x}" cy="${y}" r="${r}" fill="${i % 2 === 0 ? c1 : c2}" opacity="${0.25 + (seed % 50) / 100}" />`
  }
  return out
}

export async function generateArtwork(seedKey: string, size = 1200): Promise<Buffer> {
  const hash = hashStr(seedKey)
  const [c1, c2] = PALETTES[hash % PALETTES.length]
  const angle = hash % 360
  const variant = hash % 3

  const svg = `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%" gradientTransform="rotate(${angle} 0.5 0.5)">
        <stop offset="0%" stop-color="#0c0c14"/>
        <stop offset="100%" stop-color="#15151f"/>
      </linearGradient>
      <radialGradient id="glow1" cx="28%" cy="26%" r="62%">
        <stop offset="0%" stop-color="${c1}" stop-opacity="0.5"/>
        <stop offset="100%" stop-color="${c1}" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="glow2" cx="76%" cy="78%" r="58%">
        <stop offset="0%" stop-color="${c2}" stop-opacity="0.45"/>
        <stop offset="100%" stop-color="${c2}" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="ring" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${c1}"/>
        <stop offset="100%" stop-color="${c2}"/>
      </linearGradient>
      <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#ffffff" stroke-opacity="0.045" stroke-width="1"/>
      </pattern>
      <radialGradient id="vignette" cx="50%" cy="50%" r="75%">
        <stop offset="55%" stop-color="#000000" stop-opacity="0"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.55"/>
      </radialGradient>
    </defs>
    <rect width="${size}" height="${size}" fill="url(#bg)"/>
    <rect width="${size}" height="${size}" fill="url(#grid)"/>
    <rect width="${size}" height="${size}" fill="url(#glow1)"/>
    <rect width="${size}" height="${size}" fill="url(#glow2)"/>
    ${shapeMarkup(variant, size, hash, c1, c2)}
    <rect width="${size}" height="${size}" fill="url(#vignette)"/>
  </svg>`

  return sharp(Buffer.from(svg)).png().toBuffer()
}
