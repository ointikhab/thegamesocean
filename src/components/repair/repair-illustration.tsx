import { Sparkles, Wrench } from 'lucide-react'

export function RepairIllustration() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[280px]">
      {/* Ambient glow behind the artwork */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 rounded-full blur-3xl opacity-30"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.55), transparent 70%)' }}
      />

      <div className="animate-float relative h-full w-full">
        <svg viewBox="0 0 440 320" className="h-full w-full drop-shadow-[0_16px_32px_rgba(124,58,237,0.25)]">
          <defs>
            <linearGradient id="repairBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#0891b2" />
            </linearGradient>
          </defs>

          {/* Grips */}
          <ellipse cx="98" cy="208" rx="46" ry="58" fill="url(#repairBodyGrad)" transform="rotate(-12 98 208)" />
          <ellipse cx="342" cy="208" rx="46" ry="58" fill="url(#repairBodyGrad)" transform="rotate(12 342 208)" />

          {/* Body */}
          <rect x="68" y="108" width="304" height="112" rx="56" fill="url(#repairBodyGrad)" />
          <rect x="68" y="108" width="304" height="112" rx="56" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />

          {/* D-pad */}
          <rect x="138" y="146" width="22" height="60" rx="6" fill="#ffffff" opacity="0.92" />
          <rect x="119" y="165" width="60" height="22" rx="6" fill="#ffffff" opacity="0.92" />

          {/* Analog stick */}
          <circle cx="188" cy="205" r="17" fill="rgba(10,10,20,0.28)" />
          <circle cx="188" cy="205" r="10" fill="rgba(255,255,255,0.55)" />

          {/* Face buttons */}
          <circle cx="333" cy="150" r="10" fill="#f4b400" />
          <circle cx="357" cy="174" r="10" fill="#0891b2" />
          <circle cx="333" cy="198" r="10" fill="#db2777" />
          <circle cx="309" cy="174" r="10" fill="#059669" />

          {/* Home button */}
          <circle cx="220" cy="142" r="9" fill="rgba(10,10,20,0.22)" />
        </svg>

        {/* Wrench, laid diagonally across the controller */}
        <div className="absolute -right-2 -top-4 rotate-[38deg] text-ink-900/80 drop-shadow-[0_6px_10px_rgba(10,10,20,0.3)]">
          <Wrench size={92} strokeWidth={1.75} fill="rgba(240,240,248,0.9)" />
        </div>

        {/* Spark accent near the wrench tip */}
        <div className="absolute right-6 top-2 text-cyan-glow">
          <Sparkles size={22} strokeWidth={2} />
        </div>
        <div className="absolute right-16 top-14 text-magenta-glow opacity-80">
          <Sparkles size={14} strokeWidth={2} />
        </div>
      </div>
    </div>
  )
}
