import { CompanyProfile } from '@/lib/extractor'

const CATEGORY_COLORS: Record<string, string> = {
  frontend: 'bg-blue-50 text-blue-700 border-blue-200',
  backend: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cloud: 'bg-orange-50 text-orange-700 border-orange-200',
  data: 'bg-purple-50 text-purple-700 border-purple-200',
  devops: 'bg-amber-50 text-amber-700 border-amber-200',
  mobile: 'bg-pink-50 text-pink-700 border-pink-200',
  other: 'bg-stone-50 text-stone-600 border-stone-200',
}

function TagList({ label, tags, colorClass }: { label: string; tags: string[]; colorClass: string }) {
  if (!tags.length) return null
  return (
    <div>
      <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <span key={tag} className={`text-xs px-2.5 py-1 rounded-lg border font-medium ${colorClass}`}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function CompanyCard({ profile }: { profile: CompanyProfile }) {
  const { techStack } = profile

  return (
    <div className="bg-white border border-orange-100 rounded-2xl shadow-sm overflow-hidden">

      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100 px-6 py-5">
        <h2 className="text-xl font-bold text-stone-800">{profile.name}</h2>
        <p className="text-stone-500 mt-1 text-sm leading-relaxed">{profile.description}</p>
      </div>

      <div className="p-6 space-y-6">

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-stone-50 rounded-xl p-3 border border-stone-100">
            <p className="text-stone-400 text-xs mb-1 font-medium">IT Team Size</p>
            <p className="text-stone-700 font-semibold">{profile.teamSize || 'Unknown'}</p>
          </div>
          <div className="bg-stone-50 rounded-xl p-3 border border-stone-100">
            <p className="text-stone-400 text-xs mb-1 font-medium">Departments</p>
            <p className="text-stone-700 font-semibold">{profile.itDepartments.join(', ') || 'Unknown'}</p>
          </div>
        </div>

        <div className="space-y-4">
          <TagList label="Frontend" tags={techStack.frontend} colorClass={CATEGORY_COLORS.frontend} />
          <TagList label="Backend" tags={techStack.backend} colorClass={CATEGORY_COLORS.backend} />
          <TagList label="Cloud" tags={techStack.cloud} colorClass={CATEGORY_COLORS.cloud} />
          <TagList label="Data" tags={techStack.data} colorClass={CATEGORY_COLORS.data} />
          <TagList label="DevOps" tags={techStack.devops} colorClass={CATEGORY_COLORS.devops} />
          <TagList label="Mobile" tags={techStack.mobile} colorClass={CATEGORY_COLORS.mobile} />
          <TagList label="Other" tags={techStack.other} colorClass={CATEGORY_COLORS.other} />
        </div>

        {profile.hiringSignals.length > 0 && (
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-widest mb-3">Hiring Signals</p>
            <ul className="space-y-2">
              {profile.hiringSignals.map((signal, i) => (
                <li key={i} className="text-sm text-stone-600 flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  {signal}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="border-t border-stone-100 pt-5">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-2">Matching Summary</p>
          <p className="text-sm text-stone-600 leading-relaxed">{profile.summary}</p>
        </div>

      </div>
    </div>
  )
}
