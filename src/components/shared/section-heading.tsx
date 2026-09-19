type SectionHeadingProps = {
  eyebrow: string
  title: string
  description: string
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="max-w-4xl space-y-5">
      <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.38em] text-white/68">
        {eyebrow}
      </div>
      <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl xl:text-6xl">
        <span className="font-heading">{title}</span>
      </h2>
      <p className="max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
    </div>
  )
}
