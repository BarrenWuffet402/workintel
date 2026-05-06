import * as cheerio from 'cheerio'

const APIFY_TOKEN = process.env.APIFY_TOKEN

async function apifyScrape(query: string, maxResults = 5): Promise<string> {
  const res = await fetch(
    `https://api.apify.com/v2/acts/apify~rag-web-browser/run-sync-get-dataset-items?token=${APIFY_TOKEN}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, maxResults }),
      signal: AbortSignal.timeout(60000),
    }
  )

  if (!res.ok) throw new Error(`Apify error: ${res.status}`)

  const items = await res.json()
  return items
    .map((item: { markdown?: string; text?: string }) => item.markdown || item.text || '')
    .join('\n\n')
    .slice(0, 12000)
}

async function simpleScrape(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; WorkIntel/1.0)' },
    signal: AbortSignal.timeout(10000),
  })
  const html = await res.text()
  const $ = cheerio.load(html)
  $('script, style, nav, footer, header, [aria-hidden="true"]').remove()
  return $('body').text().replace(/\s+/g, ' ').trim().slice(0, 8000)
}

export async function scrapeCompany(companyName: string, websiteUrl?: string): Promise<string> {
  if (APIFY_TOKEN) {
    const quoted = `"${companyName}"`

    const [techQuery, careersQuery, finnQuery] = await Promise.allSettled([
      // Direct website scrape if URL is known — much higher signal than a generic search
      websiteUrl
        ? apifyScrape(websiteUrl, 3)
        : apifyScrape(`${quoted} Norge teknologi IT-avdeling software engineering stack`, 5),

      // Search for the company's own career/jobs pages — quoted name avoids aggregator drift
      apifyScrape(`${quoted} karriere jobb developer engineer teknologi`, 5),

      // Finn.no via Google — site: path-filtering is unreliable, top-level domain works better
      apifyScrape(`site:finn.no ${quoted} stilling`, 5),
    ])

    const combined = [
      techQuery.status    === 'fulfilled' ? techQuery.value    : '',
      careersQuery.status === 'fulfilled' ? careersQuery.value : '',
      finnQuery.status    === 'fulfilled' ? finnQuery.value    : '',
    ].join('\n\n')

    // If Apify returned nothing useful, fall back to a direct website scrape
    if (!combined.trim() && websiteUrl) return await simpleScrape(websiteUrl)
    return combined
  }

  if (websiteUrl) return await simpleScrape(websiteUrl)
  return ''
}
