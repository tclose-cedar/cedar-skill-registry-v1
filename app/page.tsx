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
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [installingFn, setInstallingFn] = useState<string | null>(null)
  const [installedFns, setInstalledFns] = useState<Set<string>>(new Set())

  const publishedSkills = skills.filter((s) => s.status === 'published')

  const grouped = functionOrder
    .map((fn) => ({
      fn,
      label: functionLabels[fn] ?? fn,
      skills: publishedSkills.filter((s) => s.function === fn),
    }))
    .filter((g) => g.skills.length > 0)

  const visibleGroups = activeFilter
    ? grouped.filter((g) => g.fn === activeFilter)
    : grouped

  async function handleInstallFn(fn: string, fnSkills: Skill[]) {
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
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Skill Catalog</h1>
        <p className="text-gray-500 mt-1">{publishedSkills.length} skills available</p>
      </div>

      {/* Function filter pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveFilter(null)}
          className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
            activeFilter === null
              ? 'bg-gray-900 text-white'
              : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'
          }`}
        >
          All
        </button>
        {grouped.map(({ fn, label, skills: groupSkills }) => (
          <button
            key={fn}
            onClick={() => setActiveFilter(activeFilter === fn ? null : fn)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              activeFilter === fn
                ? 'bg-gray-900 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'
            }`}
          >
            {label}
            <span className={`ml-1.5 text-xs ${activeFilter === fn ? 'text-gray-300' : 'text-gray-400'}`}>
              {groupSkills.length}
            </span>
          </button>
        ))}
      </div>

      {/* Function-grouped sections */}
      <div className="space-y-10">
        {visibleGroups.map(({ fn, label, skills: groupSkills }) => {
          const isInstalling = installingFn === fn
          const isInstalled = installedFns.has(fn)

          return (
            <section key={fn}>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-base font-semibold text-gray-800">{label}</h2>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                  {groupSkills.length}
                </span>
                <div className="flex-1 h-px bg-gray-200" />
                <button
                  onClick={() => handleInstallFn(fn, groupSkills)}
                  disabled={isInstalling || isInstalled || installingFn !== null}
                  className="shrink-0 flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:border-emerald-400 hover:text-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isInstalling && (
                    <span className="h-3 w-3 animate-spin rounded-full border border-gray-400 border-t-gray-700" />
                  )}
                  {isInstalled ? '✓ Installed' : isInstalling ? 'Installing...' : 'Install'}
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {groupSkills.map((skill) => (
                  <SkillCard key={skill.id} skill={skill} />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
