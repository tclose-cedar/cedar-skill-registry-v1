import Link from 'next/link'

export default function Nav() {
  return (
    <header className="bg-gradient-to-r from-emerald-900 to-emerald-600">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-emerald-200 text-2xl leading-none">⬡</span>
          <div>
            <span className="text-white font-bold text-lg tracking-tight">Cedar Skill Registry</span>
          </div>
        </Link>
        <span className="rounded-full border border-emerald-400/50 bg-emerald-800/50 px-3 py-1 text-xs font-medium text-emerald-100">
          v1
        </span>
      </div>
    </header>
  )
}
