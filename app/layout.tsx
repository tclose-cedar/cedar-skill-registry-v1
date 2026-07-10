import type { Metadata } from 'next'
import './globals.css'
import { StoreProvider } from '@/lib/store'
import Nav from '@/components/Nav'
import CommandLog from '@/components/CommandLog'

export const metadata: Metadata = {
  title: 'Cedar Skill Registry',
  description: 'Browse and install Cedar skills by role',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <Nav />
          <main className="pb-16">{children}</main>
          <CommandLog />
        </StoreProvider>
      </body>
    </html>
  )
}
