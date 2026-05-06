import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

// Walks character-by-character to find the first complete {...} block,
// correctly handling strings and escaped characters so greedy regex can't overshoot.
function extractFirstJsonObject(text: string): string {
  const start = text.indexOf('{')
  if (start === -1) throw new Error('No JSON object found in model response')

  let depth = 0
  let inString = false
  let escaped = false

  for (let i = start; i < text.length; i++) {
    const ch = text[i]
    if (escaped)            { escaped = false; continue }
    if (ch === '\\' && inString) { escaped = true;  continue }
    if (ch === '"')         { inString = !inString; continue }
    if (inString)           { continue }
    if (ch === '{')         { depth++ }
    if (ch === '}')         { if (--depth === 0) return text.slice(start, i + 1) }
  }

  throw new Error('Malformed JSON: unmatched braces in model response')
}

export interface CompanyProfile {
  name: string
  description: string
  techStack: {
    frontend: string[]
    backend: string[]
    cloud: string[]
    data: string[]
    devops: string[]
    mobile: string[]
    other: string[]
  }
  teamSize: string
  itDepartments: string[]
  hiringSignals: string[]
  summary: string
  linkedinSlug?: string
}

export async function extractCompanyProfile(
  companyName: string,
  scrapedContent: string
): Promise<CompanyProfile> {
  const message = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: `You are analyzing company data to extract IT department and technology information for a consultant matching system.

Company: ${companyName}

Scraped content:
${scrapedContent}

Extract and return ONLY valid JSON matching this structure:
{
  "name": "company name",
  "description": "1-2 sentence company description",
  "techStack": {
    "frontend": ["tech1", "tech2"],
    "backend": ["tech1", "tech2"],
    "cloud": ["AWS", "Azure", etc],
    "data": ["tech1", "tech2"],
    "devops": ["tech1", "tech2"],
    "mobile": ["tech1", "tech2"],
    "other": ["tech1", "tech2"]
  },
  "teamSize": "estimated IT team size or range",
  "itDepartments": ["Engineering", "Data", "DevOps", etc],
  "hiringSignals": ["actively hiring React devs", "expanding cloud team", etc],
  "summary": "2-3 sentence summary of their IT setup relevant for consultant matching"
}

If information is not available, use empty arrays or "Unknown". Return only the JSON, no other text.`,
      },
    ],
  })

  const content = message.content[0]
  if (content.type !== 'text') throw new Error('Unexpected response type')

  return JSON.parse(extractFirstJsonObject(content.text))
}
