'use client'
import { use } from 'react'
import Link from 'next/link'
import { useStore } from '@/lib/store'

const sourceColors: Record<string, string> = {
  marco: 'bg-violet-100 text-violet-700',
  rootstock: 'bg-blue-100 text-blue-700',
  'cm-ops': 'bg-emerald-100 text-emerald-700',
  'kora-sierra': 'bg-teal-100 text-teal-700',
}

export default function SkillDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { skills } = useStore()

  const skillId = decodeURIComponent(id)
  const skill = skills.find((s) => s.id === skillId)

  if (!skill) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <p className="text-gray-400">Skill not found.</p>
        <Link href="/" className="mt-4 inline-block text-sm text-emerald-600 hover:underline">
          &larr; Back to catalog
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <Link
        href="/"
        className="text-sm text-gray-400 hover:text-gray-600 transition-colors mb-6 inline-block"
      >
        &larr; Back to catalog
      </Link>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${sourceColors[skill.source] ?? 'bg-gray-100 text-gray-600'}`}>
            {skill.source}
          </span>
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
            {skill.function}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{skill.name}</h1>
        <p className="text-gray-500 leading-relaxed">{skill.description}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8 rounded-xl border border-gray-200 bg-white p-5">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Author</p>
          <p className="text-sm text-gray-700">{skill.author}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Updated</p>
          <p className="text-sm text-gray-700">{skill.updatedAt}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Usage</p>
          <p className="text-sm text-gray-700">{skill.usageCount} uses</p>
        </div>
        {skill.requiredTools.length > 0 && (
          <div className="col-span-2 sm:col-span-3">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1.5">Required tools</p>
            <div className="flex flex-wrap gap-1.5">
              {skill.requiredTools.map((t) => (
                <span key={t} className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
        {skill.requiredContext.length > 0 && (
          <div className="col-span-2 sm:col-span-3">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1.5">Required context</p>
            <div className="flex flex-wrap gap-1.5">
              {skill.requiredContext.map((c) => (
                <span key={c} className="rounded-md bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}
        {skill.tags.length > 0 && (
          <div className="col-span-2 sm:col-span-3">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1.5">Tags</p>
            <div className="flex flex-wrap gap-1.5">
              {skill.tags.map((tag) => (
                <span key={tag} className="rounded-md bg-gray-50 border border-gray-200 px-2 py-0.5 text-xs text-gray-500">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {skill.content && (
        <div>
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Skill content</h2>
          <pre className="rounded-xl bg-gray-900 text-gray-100 p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap font-mono">
            {skill.content}
          </pre>
        </div>
      )}
    </div>
  )
}
