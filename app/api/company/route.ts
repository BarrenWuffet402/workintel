import { NextRequest, NextResponse } from 'next/server'
import { scrapeCompany } from '@/lib/scraper'
import { extractCompanyProfile } from '@/lib/extractor'

export async function POST(req: NextRequest) {
  const { name, url } = await req.json()

  if (!name) return NextResponse.json({ error: 'Company name required' }, { status: 400 })

  try {
    const content = await scrapeCompany(name, url)

    if (!content.trim()) {
      return NextResponse.json({ error: 'Could not scrape any content' }, { status: 422 })
    }

    const profile = await extractCompanyProfile(name, content)
    return NextResponse.json(profile)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[/api/company]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
