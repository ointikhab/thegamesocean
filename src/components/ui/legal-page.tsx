import { Reveal } from '@/components/ui/reveal'
import { SectionHeading } from '@/components/ui/section-heading'

export type LegalSection = {
  heading: string
  body: React.ReactNode
}

export function LegalPage({
  eyebrow,
  title,
  updated,
  intro,
  sections,
}: {
  eyebrow: string
  title: string
  updated: string
  intro?: string
  sections: LegalSection[]
}) {
  return (
    <div className="relative">
      <div className="bg-grid pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] opacity-30" />

      <div className="mx-auto max-w-3xl px-4 pb-24 pt-14 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading eyebrow={eyebrow} title={title} description={intro} align="center" className="mx-auto" />
          <p className="mt-4 text-center text-xs text-ink-400">Last updated: {updated}</p>
          <div className="divider-glow mt-8" />
        </Reveal>

        <div className="mt-12 flex flex-col gap-10">
          {sections.map((s, i) => (
            <Reveal key={s.heading} index={i}>
              <h2 className="font-display text-lg font-bold text-ink-900">{s.heading}</h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-500">{s.body}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  )
}
