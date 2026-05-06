import { CompanyProfile } from './extractor'
import { SEED_COMPANIES } from './seedData'

const STORAGE_KEY = 'workintel_companies'
const SEED_FLAG = 'workintel_seeded_v1'

export function seedIfEmpty(): void {
  if (typeof window === 'undefined') return
  if (localStorage.getItem(SEED_FLAG)) return
  if (loadCompanies().length === 0) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_COMPANIES))
  }
  localStorage.setItem(SEED_FLAG, '1')
}

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
