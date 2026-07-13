import Link from 'next/link'

export default function Nav() {
  return (
    <header style={{ backgroundColor: '#b2f200' }} className="flex h-16 items-center">
      {/* Title column — same width as the sidebar */}
      <div className="w-56 shrink-0 px-4">
        <Link href="/">
          <span style={{ color: '#1a3300' }} className="font-bold text-lg tracking-tight">
            Cedar Skill Registry
          </span>
        </Link>
      </div>

      {/* Right section — sits over the content panel */}
      <div className="flex-1 flex items-center justify-end px-8">
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
