"use client"

import React from "react"
import { motion } from "framer-motion"

type Project = {
  category?: string
  title?: string
  summary?: string
  architecture?: string[]
  metrics?: string[]
}

export default function DetailModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  if (!project) return null

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="relative z-50 max-h-[88dvh] w-[min(900px,95%)] overflow-y-auto rounded-xl border border-white/10 bg-white/6 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-300/75">{project.category}</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">{project.title}</h2>
            <p className="mt-3 text-sm text-white/72">{project.summary}</p>
          </div>
          <button onClick={onClose} className="text-sm text-white/60">Close</button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-white/42">Architecture</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(project.architecture ?? []).map((a: string) => (
                <span key={a} className="rounded-md border border-white/8 bg-white/5 px-3 py-1.5 text-xs text-white/68">{a}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-white/42">Metrics</p>
            <div className="mt-3 grid gap-2">
              {(project.metrics ?? []).map((m: string) => (
                <div key={m} className="rounded-md border border-white/8 bg-black/20 p-3 text-sm text-white/72">{m}</div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
