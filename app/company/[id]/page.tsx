'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { loadCompanies, SavedCompany } from '@/lib/storage'

const TECH_CATEGORIES = [
  { key: 'frontend', label: 'Frontend', gradient: 'from-blue-400 to-cyan-400',     badge: 'bg-blue-950 text-blue-300 hover:bg-blue-900' },
  { key: 'backend',  label: 'Backend',  gradient: 'from-emerald-400 to-teal-400',  badge: 'bg-emerald-950 text-emerald-300 hover:bg-emerald-900' },
  { key: 'cloud',    label: 'Cloud',    gradient: 'from-orange-400 to-amber-400',  badge: 'bg-orange-950 text-orange-300 hover:bg-orange-900' },
  { key: 'data',     label: 'Data',     gradient: 'from-purple-400 to-violet-400', badge: 'bg-purple-950 text-purple-300 hover:bg-purple-900' },
  { key: 'devops',   label: 'DevOps',   gradient: 'from-yellow-400 to-orange-400', badge: 'bg-yellow-950 text-yellow-300 hover:bg-yellow-900' },
  { key: 'mobile',   label: 'Mobile',   gradient: 'from-pink-400 to-rose-400',     badge: 'bg-pink-950 text-pink-300 hover:bg-pink-900' },
  { key: 'other',    label: 'Other',    gradient: 'from-stone-400 to-stone-500',   badge: 'bg-stone-800 text-stone-300 hover:bg-stone-700' },
] as const

export default function CompanyPage() {
  const { id } = useParams<{ id: string }>()
  const [company, setCompany] = useState<SavedCompany | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const found = loadCompanies().find(c => c.id === id)
    if (found) setCompany(found)
    else setNotFound(true)
  }, [id])

  if (notFound) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone-500 mb-4">Company not found</p>
          <Link href="/" className="text-orange-400 hover:text-orange-300 text-sm transition-colors">← Back to WorkIntel</Link>
        </div>
      </div>
    )
  }

  if (!company) return null

  const stackWithItems = TECH_CATEGORIES.filter(
    cat => company.techStack[cat.key as keyof typeof company.techStack].length > 0
  )
  const finnUrl = `https://www.finn.no/job/search?q=${encodeURIComponent(company.name)}`

  return (
    <div className="min-h-screen bg-stone-950 text-white">

      {/* Fixed nav */}
      <nav className="fixed top-0 inset-x-0 z-20 flex items-center justify-between px-6 sm:px-10 py-4 bg-stone-950/70 backdrop-blur-md border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors text-sm font-medium">
          <span>←</span> WorkIntel
        </Link>
        <a
          href={finnUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
        >
          Open roles on Finn →
        </a>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 sm:px-16 overflow-hidden">

        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(194,65,12,0.15) 0%, transparent 70%), #0c0a09' }}
        />

        <div aria-hidden className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span
            className="font-black text-white leading-none tracking-tighter whitespace-nowrap"
            style={{ fontSize: 'clamp(5rem, 22vw, 22rem)', opacity: 0.025 }}
          >
            {company.name}
          </span>
        </div>

        <div
          aria-hidden
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full animate-pulse pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)', animationDuration: '3s' }}
        />

        <div className="relative max-w-5xl w-full mx-auto pt-24">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-8 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            Tech Company Profile
          </div>

          <h1
            className="font-black tracking-tighter text-white leading-[0.9] mb-8"
            style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)' }}
          >
            {company.name}
          </h1>

          <p className="text-stone-400 max-w-2xl leading-relaxed mb-10" style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}>
            {company.description}
          </p>

          <div className="flex flex-wrap gap-3">
            {company.itDepartments.map(dept => (
              <span key={dept} className="text-sm text-stone-300 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                {dept}
              </span>
            ))}
            {company.teamSize && (
              <span className="text-sm text-orange-300 bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-full">
                ~{company.teamSize}
              </span>
            )}
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-stone-700">
          <span className="text-xs tracking-widest uppercase">scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-stone-700 to-transparent" />
        </div>
      </section>

      {/* Tech stack */}
      {stackWithItems.length > 0 && (
        <section className="px-6 sm:px-16 py-28">
          <div className="max-w-5xl mx-auto">
            <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-3">Engineering</p>
            <h2 className="font-bold text-white mb-16" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              The stack.
            </h2>

            <div className="space-y-8">
              {stackWithItems.map(cat => {
                const items = company.techStack[cat.key as keyof typeof company.techStack]
                return (
                  <div key={cat.key} className="flex items-start gap-8">
                    <div className="w-20 shrink-0 pt-1.5">
                      <span className={`text-xs font-bold uppercase tracking-widest bg-gradient-to-r ${cat.gradient} bg-clip-text text-transparent`}>
                        {cat.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {items.map(tech => (
                        <span key={tech} className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-all cursor-default ${cat.badge}`}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Hiring signals */}
      {company.hiringSignals.length > 0 && (
        <section className="px-6 sm:px-16 py-28 border-t border-white/5">
          <div className="max-w-5xl mx-auto">
            <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-3">Opportunities</p>
            <h2 className="font-bold text-white mb-16" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              We&apos;re growing.
            </h2>

            <div className="grid sm:grid-cols-2 gap-4 mb-14">
              {company.hiringSignals.map((signal, i) => (
                <div
                  key={i}
                  className="group p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-orange-500/5 hover:border-orange-500/20 transition-all duration-200"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-orange-500 shrink-0 group-hover:scale-110 transition-transform" />
                    <p className="text-stone-300 text-sm leading-relaxed">{signal}</p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href={finnUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-semibold px-6 py-3.5 rounded-2xl transition-colors"
            >
              View open roles on Finn.no →
            </a>
          </div>
        </section>
      )}

      {/* Summary */}
      <section className="px-6 sm:px-16 py-28 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-6">The takeaway</p>
          <p className="text-stone-300 leading-relaxed" style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)' }}>
            {company.summary}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 sm:px-16 py-8 border-t border-white/5">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-stone-600">
          <span>Powered by WorkIntel</span>
          <Link href="/" className="hover:text-stone-400 transition-colors">← Dashboard</Link>
        </div>
      </footer>

    </div>
  )
}
