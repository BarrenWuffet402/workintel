'use client'

import { useState, useEffect } from 'react'
import CompanyTable from '@/components/CompanyTable'
import { saveCompany, loadCompanies, deleteCompany, seedIfEmpty, SavedCompany } from '@/lib/storage'

export default function Home() {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [companies, setCompanies] = useState<SavedCompany[]>([])

  useEffect(() => {
    seedIfEmpty()
    setCompanies(loadCompanies())
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/company', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, url }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'Something went wrong')
    } else {
      saveCompany(data)
      setCompanies(loadCompanies())
      setName('')
      setUrl('')
    }
  }

  function handleDelete(id: string) {
    deleteCompany(id)
    setCompanies(loadCompanies())
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-6 sm:p-10">
      <div className="max-w-screen-xl mx-auto">

        <div className="flex items-center gap-4 mb-7">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-orange-500 shadow-md shrink-0">
            <span className="text-lg text-white font-bold select-none">W</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-stone-800 leading-tight">WorkIntel</h1>
            <p className="text-stone-500 text-sm">Company tech intelligence for consultant matching</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-5 mb-6">
          <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-44">
              <label className="block text-xs font-medium text-stone-600 mb-1.5">Company name</label>
              <input
                type="text"
                placeholder="e.g. DNB, Equinor, Aker BP"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-stone-800 placeholder-stone-400 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
              />
            </div>
            <div className="flex-1 min-w-44">
              <label className="block text-xs font-medium text-stone-600 mb-1.5">
                Website URL <span className="text-stone-400 font-normal">(optional)</span>
              </label>
              <input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={e => setUrl(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-stone-800 placeholder-stone-400 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-400 active:bg-orange-600 disabled:bg-orange-200 disabled:cursor-not-allowed text-white rounded-xl px-5 py-2.5 font-semibold text-sm transition-colors shadow-sm whitespace-nowrap"
            >
              {loading ? 'Analyzing…' : 'Analyze Company'}
            </button>
          </form>

          {loading && (
            <div className="flex items-center gap-2 mt-3 text-stone-400 text-sm">
              <div className="w-4 h-4 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin shrink-0" />
              Scraping and extracting tech profile&hellip;
            </div>
          )}

          {error && (
            <p className="mt-3 text-sm text-red-500">{error}</p>
          )}
        </div>

        <CompanyTable companies={companies} onDelete={handleDelete} />

      </div>
    </main>
  )
}
