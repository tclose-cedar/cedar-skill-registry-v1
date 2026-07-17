'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useStore } from '@/lib/store'
import { mockInstallSkills } from '@/lib/mockGithub'
import { Skill } from '@/lib/types'

const sourceColors: Record<string, string> = {
  marco: 'bg-violet-100 text-violet-700',
  rootstock: 'bg-blue-100 text-blue-700',
  'cm-ops': 'bg-[#dbffb5] text-gray-800',
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
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${sourceColors[skill.source] ?? 'bg-gray-100 text-[#6e6e6e]'}`}>
            {skill.source}
          </span>
          {isNew && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
              New
            </span>
          )}
        </div>
        <span className="shrink-0 text-xs text-[#6e6e6e]">{skill.usageCount} uses</span>
      </div>
      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">
        {skill.name}
      </h3>
      <p className="text-sm text-[#6e6e6e] line-clamp-2 flex-1 mb-3">{skill.description}</p>
      {skill.requiredTools.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-auto">
          {skill.requiredTools.slice(0, 3).map((t) => (
            <span key={t} className="rounded-md bg-gray-100 px-1.5 py-0.5 text-xs text-[#6e6e6e]">
              {t}
            </span>
          ))}
          {skill.requiredTools.length > 3 && (
            <span className="text-xs text-[#6e6e6e]">+{skill.requiredTools.length - 3}</span>
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

  const [activeFn, setActiveFn] = useState<string | 'all'>(grouped[0]?.fn ?? 'all')
  const [installingFn, setInstallingFn] = useState<string | null>(null)
  const [installedFns, setInstalledFns] = useState<Set<string>>(new Set())

  const activeGroup = grouped.find((g) => g.fn === activeFn) ?? null

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
    <div className="flex" style={{ height: 'calc(100vh - 64px - 40px)' }}>

      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-gray-200 bg-[#f9f8f1] flex flex-col overflow-y-auto">
        <div className="px-4 py-5 border-b border-gray-100">
          <p className="text-xs font-semibold text-[#6e6e6e] uppercase tracking-wide">Functions</p>
        </div>
        <nav className="flex-1 py-2">
          {/* All */}
          <button
            onClick={() => setActiveFn('all')}
            className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors rounded-[40rem] ${
              activeFn === 'all'
                ? 'bg-[#dbffb5] text-gray-900 font-medium'
                : 'text-[#6e6e6e] hover:bg-gray-50'
            }`}
          >
            <span>All</span>
            <span className={`rounded-full px-2 py-0.5 text-xs ${activeFn === 'all' ? 'bg-[#b2f200] text-gray-900' : 'bg-gray-100 text-[#6e6e6e]'}`}>
              {publishedSkills.length}
            </span>
          </button>

          {/* Divider */}
          <div className="mx-4 my-1.5 h-px bg-gray-100" />

          {/* Per-function */}
          {grouped.map(({ fn, label, skills: groupSkills }) => {
            const isActive = fn === activeFn
            const isInstalled = installedFns.has(fn)
            return (
              <button
                key={fn}
                onClick={() => setActiveFn(fn)}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors rounded-[40rem] ${
                  isActive
                    ? 'bg-[#dbffb5] text-gray-900 font-medium'
                    : 'text-[#6e6e6e] hover:bg-gray-50'
                }`}
              >
                <span>{label}</span>
                <div className="flex items-center gap-1.5">
                  {isInstalled && <span className="text-[#6e6e6e] text-xs">✓</span>}
                  <span className={`rounded-full px-2 py-0.5 text-xs ${isActive ? 'bg-[#b2f200] text-gray-900' : 'bg-gray-100 text-[#6e6e6e]'}`}>
                    {groupSkills.length}
                  </span>
                </div>
              </button>
            )
          })}
        </nav>
        <div className="px-4 py-3 border-t border-gray-100">
          <p className="text-xs text-[#6e6e6e]">{publishedSkills.length} skills total</p>
        </div>
      </aside>

      {/* Content panel */}
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="p-8">
          {activeFn === 'all' ? (
            /* All view — grouped sections with per-section install */
            <div className="space-y-10">
              {grouped.map(({ fn, label, skills: groupSkills }) => (
                <section key={fn}>
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-base font-semibold text-gray-800">{label}</h2>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-[#6e6e6e]">
                      {groupSkills.length}
                    </span>
                    <div className="flex-1 h-px bg-gray-200" />
                    <button
                      onClick={() => handleInstall(fn, groupSkills)}
                      disabled={installingFn !== null || installedFns.has(fn)}
                      className="shrink-0 flex items-center gap-1.5 rounded-[40rem] border border-[#b2f200] bg-[#b2f200] px-3 py-1.5 text-xs font-medium text-gray-900 hover:bg-[#dbffb5] hover:border-[#dbffb5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {installingFn === fn && (
                        <span className="h-3 w-3 animate-spin rounded-full border border-gray-900/20 border-t-gray-900" />
                      )}
                      {installedFns.has(fn) ? '✓ Installed' : installingFn === fn ? 'Installing...' : 'Install'}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groupSkills.map((skill) => (
                      <SkillCard key={skill.id} skill={skill} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : activeGroup ? (
            /* Single-function view */
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{activeGroup.label}</h1>
                  <p className="text-sm text-[#6e6e6e] mt-0.5">{activeGroup.skills.length} skills</p>
                </div>
                <button
                  onClick={() => handleInstall(activeGroup.fn, activeGroup.skills)}
                  disabled={installingFn !== null || installedFns.has(activeGroup.fn)}
                  className="shrink-0 flex items-center gap-1.5 rounded-[40rem] border border-[#b2f200] bg-[#b2f200] px-3 py-1.5 text-xs font-medium text-gray-900 hover:bg-[#dbffb5] hover:border-[#dbffb5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {installingFn === activeGroup.fn && (
                    <span className="h-3 w-3 animate-spin rounded-full border border-gray-900/20 border-t-gray-900" />
                  )}
                  {installedFns.has(activeGroup.fn)
                    ? '✓ Installed'
                    : installingFn === activeGroup.fn
                    ? 'Installing...'
                    : `Install ${activeGroup.label}`}
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeGroup.skills.map((skill) => (
                  <SkillCard key={skill.id} skill={skill} />
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}
