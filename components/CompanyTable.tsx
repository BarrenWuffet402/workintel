'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SavedCompany } from '@/lib/storage'

const TECH_COLORS: Record<string, string> = {
  frontend: 'bg-blue-50 text-blue-700',
  backend: 'bg-emerald-50 text-emerald-700',
  cloud: 'bg-orange-50 text-orange-700',
  data: 'bg-purple-50 text-purple-700',
  devops: 'bg-amber-50 text-amber-700',
  mobile: 'bg-pink-50 text-pink-700',
  other: 'bg-stone-100 text-stone-600',
}

function TechBadges({ techStack }: { techStack: SavedCompany['techStack'] }) {
  const all = Object.entries(techStack).flatMap(([cat, items]) => items.map(t => ({ t, cat })))
  if (!all.length) return <span className="text-stone-400 text-xs">—</span>
  return (
    <div className="flex flex-wrap gap-1">
      {all.map(({ t, cat }) => (
        <span key={`${cat}-${t}`} className={`text-xs px-1.5 py-0.5 rounded font-medium ${TECH_COLORS[cat] ?? TECH_COLORS.other}`}>
          {t}
        </span>
      ))}
    </div>
  )
}

function matches(value: string, filter: string) {
  return value.toLowerCase().includes(filter.toLowerCase().trim())
}

const COLUMNS = [
  { key: 'name',        label: 'Company',         width: 'min-w-36' },
  { key: 'description', label: 'Description',      width: 'min-w-52' },
  { key: 'roles',       label: 'Roles',            width: 'min-w-44' },
  { key: 'tech',        label: 'Technologies',     width: 'min-w-72' },
  { key: 'teamSize',    label: 'Team Size',        width: 'min-w-28' },
  { key: 'hiring',      label: 'Hiring Signals',   width: 'min-w-52' },
  { key: 'summary',     label: 'Summary',          width: 'min-w-56' },
] as const

type FilterKey = typeof COLUMNS[number]['key']
type Filters = Record<FilterKey, string>

const EMPTY_FILTERS: Filters = { name: '', description: '', roles: '', tech: '', teamSize: '', hiring: '', summary: '' }

export default function CompanyTable({
  companies,
  onDelete,
}: {
  companies: SavedCompany[]
  onDelete: (id: string) => void
}) {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)

  function setFilter(key: FilterKey, value: string) {
    setFilters(f => ({ ...f, [key]: value }))
  }

  const filtered = companies.filter(c => {
    const allTech = Object.values(c.techStack).flat().join(' ')
    return (
      (!filters.name        || matches(c.name, filters.name)) &&
      (!filters.description || matches(c.description, filters.description)) &&
      (!filters.roles       || matches(c.itDepartments.join(' '), filters.roles)) &&
      (!filters.tech        || matches(allTech, filters.tech)) &&
      (!filters.teamSize    || matches(c.teamSize ?? '', filters.teamSize)) &&
      (!filters.hiring      || matches(c.hiringSignals.join(' '), filters.hiring)) &&
      (!filters.summary     || matches(c.summary, filters.summary))
    )
  })

  const hasFilters = Object.values(filters).some(v => v !== '')

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
              {COLUMNS.map(col => (
                <th key={col.key} className={`text-left px-4 pt-3 pb-1 ${col.width}`}>
                  <span className="text-xs font-semibold text-stone-500 uppercase tracking-widest whitespace-nowrap">
                    {col.label}
                  </span>
                </th>
              ))}
              <th className="px-4 pt-3 pb-1 min-w-36">
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-widest whitespace-nowrap">Visit Company</span>
              </th>
              <th className="px-4 pt-3 pb-1 min-w-16" />
            </tr>
            <tr className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-stone-100">
              {COLUMNS.map(col => (
                <td key={col.key} className="px-3 pb-2.5 pt-1">
                  <input
                    type="text"
                    value={filters[col.key]}
                    onChange={e => setFilter(col.key, e.target.value)}
                    placeholder="Filter…"
                    className="w-full bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 placeholder-stone-300 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100"
                  />
                </td>
              ))}
              <td className="px-3 pb-2.5 pt-1" />
              <td className="px-3 pb-2.5 pt-1 text-right">
                {hasFilters && (
                  <button
                    onClick={() => setFilters(EMPTY_FILTERS)}
                    className="text-xs text-stone-400 hover:text-orange-500 transition-colors whitespace-nowrap"
                  >
                    Clear all
                  </button>
                )}
              </td>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length + 2} className="text-center py-12 text-stone-400 text-sm">
                  {hasFilters ? 'No companies match your filters' : 'No companies yet'}
                </td>
              </tr>
            ) : (
              filtered.map((c, i) => (
                <tr
                  key={c.id}
                  className={`border-b border-stone-50 align-top hover:bg-orange-50/40 transition-colors ${i % 2 !== 0 ? 'bg-stone-50/40' : ''}`}
                >
                  <td className="px-4 py-3 font-semibold text-stone-800 whitespace-nowrap">{c.name}</td>
                  <td className="px-4 py-3 text-xs text-stone-500 leading-relaxed">{c.description || '—'}</td>
                  <td className="px-4 py-3">
                    {c.itDepartments.length ? (
                      <ul className="space-y-0.5">
                        {c.itDepartments.map(r => (
                          <li key={r} className="text-xs text-stone-700">{r}</li>
                        ))}
                      </ul>
                    ) : <span className="text-stone-400 text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <TechBadges techStack={c.techStack} />
                  </td>
                  <td className="px-4 py-3 text-xs text-stone-600 whitespace-nowrap">{c.teamSize || '—'}</td>
                  <td className="px-4 py-3">
                    {c.hiringSignals.length ? (
                      <ul className="space-y-1">
                        {c.hiringSignals.map((s, j) => (
                          <li key={j} className="text-xs text-stone-600 flex items-start gap-1.5">
                            <span className="mt-1 w-1 h-1 rounded-full bg-amber-400 shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    ) : <span className="text-stone-400 text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3 text-xs text-stone-500 leading-relaxed">{c.summary || '—'}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/company/${c.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-500 hover:text-orange-400 bg-orange-50 hover:bg-orange-100 border border-orange-200 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap"
                    >
                      View profile <span>→</span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => onDelete(c.id)}
                      title="Remove"
                      className="text-stone-300 hover:text-red-400 transition-colors leading-none"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-2 bg-stone-50 border-t border-stone-100 text-xs text-stone-400">
        {filtered.length} of {companies.length} {companies.length === 1 ? 'company' : 'companies'}
      </div>
    </div>
  )
}
