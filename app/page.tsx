'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useStore } from '@/lib/store'
import { mockInstallSkills } from '@/lib/mockGithub'
import { Skill } from '@/lib/types'

const sourceColors: Record<string, string> = {
  marco: 'bg-violet-100 text-violet-700',
  rootstock: 'bg-blue-100 text-blue-700',
  'cm-ops': 'bg-emerald-100 text-emerald-700',
  'kora-sierra': 'bg-teal-100 text-teal-700',
}

const functionLabels: Record<string, string> = {
  'engineering': 'Engineering',
  'product-discovery': 'Product Discovery',
  'experimentation': 'Experimentation',
  'design': 'Design',
  'operational': 'Operational',
  'cm-ops': 'CM Ops',
}

const functionOrder = ['engineering', 'product-discovery', 'experimentation', 'design', 'operational', 'cm-ops']

function SkillCard({ skill }: { skill: Skill }) {
  const isNew = (Date.now() - new Date(skill.createdAt).getTime()) < 30 * 24 * 60 * 60 * 1000

  return (
    <Link
      href={`/skills/${encodeURIComponent(skill.id)}`}
      className="group flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:border-gray-300 hover:shadow-md transition-all duration-150"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex flex-wrap gap-1.5">
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${sourceColors[skill.source] ?? 'bg-gray-100 text-gray-600'}`}>
            {skill.source}
          </span>
          {isNew && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
              New
            </span>
          )}
        </div>
        <span className="shrink-0 text-xs text-gray-400">{skill.usageCount} uses</span>
      </div>
      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-emerald-700 transition-colors">
        {skill.name}
      </h3>
      <p className="text-sm text-gray-500 line-clamp-2 flex-1 mb-3">{skill.description}</p>
      {skill.requiredTools.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-auto">
          {skill.requiredTools.slice(0, 3).map((t) => (
            <span key={t} className="rounded-md bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">
              {t}
            </span>
          ))}
          {skill.requiredTools.length > 3 && (
            <span className="text-xs text-gray-400">+{skill.requiredTools.length - 3}</span>
          )}
        </div>
      )}
    </Link>
  )
}

export default function Home() {
  const { skills } = useStore()
  const publishedSkills = skills.filter((s) => s.status === 'published')

  const grouped = functionOrder
    .map((fn) => ({
      fn,
      label: functionLabels[fn] ?? fn,
      skills: publishedSkills.filter((s) => s.function === fn),
    }))
    .filter((g) => g.skills.length > 0)

  const [activeFn, setActiveFn] = useState(grouped[0]?.fn ?? null)
  const [installingFn, setInstallingFn] = useState<string | null>(null)
  const [installedFns, setInstalledFns] = useState<Set<string>>(new Set())

  const activeGroup = grouped.find((g) => g.fn === activeFn) ?? grouped[0]

  async function handleInstall(fn: string, fnSkills: Skill[]) {
    setInstallingFn(fn)
    await mockInstallSkills(
      fnSkills.map((s) => s.id),
      fnSkills.map((s) => s.name),
      fn
    )
    setInstallingFn(null)
    setInstalledFns((prev) => new Set(prev).add(fn))
  }

  return (
    // Full-height layout between nav (56px) and command log (40px)
    <div className="flex" style={{ height: 'calc(100vh - 56px - 40px)' }}>

      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-gray-200 bg-white flex flex-col overflow-y-auto">
        <div className="px-4 py-5 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Functions</p>
        </div>
        <nav className="flex-1 py-2">
          {grouped.map(({ fn, label, skills: groupSkills }) => {
            const isActive = fn === activeFn
            const isInstalled = installedFns.has(fn)
            return (
              <button
                key={fn}
                onClick={() => setActiveFn(fn)}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>{label}</span>
                <div className="flex items-center gap-1.5">
                  {isInstalled && <span className="text-emerald-500 text-xs">✓</span>}
                  <span className={`rounded-full px-2 py-0.5 text-xs ${isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                    {groupSkills.length}
                  </span>
                </div>
              </button>
            )
          })}
        </nav>
        <div className="px-4 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">{publishedSkills.length} skills total</p>
        </div>
      </aside>

      {/* Content panel */}
      <div className="flex-1 overflow-y-auto">
        {activeGroup && (
          <div className="p-8">
            {/* Panel header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-xl font-bold text-gray-900">{activeGroup.label}</h1>
                <p className="text-sm text-gray-400 mt-0.5">{activeGroup.skills.length} skills</p>
              </div>
              <button
                onClick={() => handleInstall(activeGroup.fn, activeGroup.skills)}
                disabled={installingFn !== null || installedFns.has(activeGroup.fn)}
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                {installingFn === activeGroup.fn && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                )}
                {installedFns.has(activeGroup.fn)
                  ? '✓ Installed'
                  : installingFn === activeGroup.fn
                  ? 'Installing...'
                  : `Install ${activeGroup.label}`}
              </button>
            </div>

            {/* Skills grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeGroup.skills.map((skill) => (
                <SkillCard key={skill.id} skill={skill} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
