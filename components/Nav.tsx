import Link from 'next/link'

export default function Nav() {
  return (
    <header style={{ backgroundColor: '#b2f200' }}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span style={{ color: '#1a3300' }} className="font-bold text-lg tracking-tight">
            Cedar Skill Registry
          </span>
        </Link>
        <span
          style={{ color: '#1a3300', borderColor: 'rgba(0,0,0,0.15)', backgroundColor: 'rgba(0,0,0,0.08)' }}
          className="rounded-full border px-3 py-1 text-xs font-medium"
        >
          v1
        </span>
      </div>
    </header>
  )
}
