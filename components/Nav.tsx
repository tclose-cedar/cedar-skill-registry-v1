import Link from 'next/link'

export default function Nav() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-emerald-600 text-lg">⬡</span>
          <span className="font-semibold text-gray-900">Cedar Skill Registry</span>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">v1</span>
        </Link>
      </div>
    </header>
  )
}
