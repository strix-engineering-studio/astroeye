type PageShellProps = {
  eyebrow: string
  title: string
  description: string
  children?: React.ReactNode
}

export function PageShell({ eyebrow, title, description, children }: PageShellProps) {
  return (
    <section className="section-space">
      <div className="strix-container space-y-12">
        <div className="relative overflow-hidden rounded-lg border border-border bg-card px-5 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:px-8 sm:py-12 lg:px-12 lg:py-16">
          <div aria-hidden="true" className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(215,255,79,0.10),transparent_62%)]" />
          <div className="max-w-4xl space-y-5">
            <div className="relative inline-flex items-center rounded border border-primary/30 bg-primary/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
              {eyebrow}
            </div>
            <h1 className="relative text-balance text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl lg:text-6xl">
              <span className="font-heading">{title}</span>
            </h1>
            <p className="relative max-w-3xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
          </div>
        </div>
        {children ? <div className="space-y-8">{children}</div> : null}
      </div>
    </section>
  )
}
