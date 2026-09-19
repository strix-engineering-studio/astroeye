import Link from "next/link"

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-start justify-center px-5 py-20 sm:px-6 lg:px-8">
      <p className="text-sm uppercase tracking-[0.35em] text-emerald-300/80">404</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">That page doesn&apos;t exist.</h1>
      <p className="mt-4 max-w-xl text-white/64">The route may have moved or the slug may be invalid. Return to the main experience and continue exploring.</p>
      <Link href="/" className="mt-8 inline-flex rounded-full bg-emerald-400 px-5 py-3 text-sm font-medium text-slate-950">
        Back home
      </Link>
    </div>
  )
}
