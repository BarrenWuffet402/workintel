import { CompanyProfile } from './extractor'

const STORAGE_KEY = 'workintel_companies'

export interface SavedCompany extends CompanyProfile {
  id: string
  savedAt: string
}

export function loadCompanies(): SavedCompany[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

export function saveCompany(profile: CompanyProfile): void {
  const companies = loadCompanies()
  const entry: SavedCompany = { ...profile, id: crypto.randomUUID(), savedAt: new Date().toISOString() }
  const idx = companies.findIndex(c => c.name.toLowerCase() === profile.name.toLowerCase())
  if (idx >= 0) {
    companies[idx] = entry
  } else {
    companies.unshift(entry)
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(companies))
}

export function deleteCompany(id: string): void {
  const companies = loadCompanies().filter(c => c.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(companies))
}
