'use client'
import { useStore } from '@/lib/store'
import { CommandLogEntry } from '@/lib/types'

const typeColors: Record<CommandLogEntry['type'], string> = {
  api: 'text-blue-400',
  webhook: 'text-yellow-400',
  ci: 'text-green-400',
}

const typeLabels: Record<CommandLogEntry['type'], string> = {
  api: 'api',
  webhook: 'webhook',
  ci: 'ci',
}

function formatParams(params: Record<string, unknown>) {
  return Object.entries(params).map(([k, v]) => (
    <div key={k} className="ml-4 text-gray-400">
      <span className="text-gray-500">{k}:</span>{' '}
      <span className="text-gray-300">{String(v)}</span>
    </div>
  ))
}

export default function CommandLog() {
  const { log, logOpen, toggleLog } = useStore()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-700 bg-gray-950 font-mono text-xs">
      <button
        onClick={toggleLog}
        className="flex w-full items-center justify-between px-4 py-2 hover:bg-gray-900 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-gray-400">⬡ Command Log</span>
          {log.length > 0 && (
            <span className="rounded bg-gray-800 px-2 py-0.5 text-gray-300">
              {log.length} call{log.length !== 1 ? 's' : ''}
            </span>
          )}
          {log.length === 0 && (
            <span className="text-gray-600 italic">No commands yet — try installing a skill pack</span>
          )}
        </div>
        <span className="text-gray-500">{logOpen ? '▼' : '▲'}</span>
      </button>

      {logOpen && (
        <div className="max-h-64 overflow-y-auto border-t border-gray-800">
          {log.length === 0 ? (
            <div className="px-4 py-6 text-center text-gray-600">
              No commands logged yet. Install a skill pack to see API calls here.
            </div>
          ) : (
            <div className="divide-y divide-gray-800/50">
              {[...log].reverse().map((entry) => (
                <div key={entry.id} className="px-4 py-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-gray-600 shrink-0">
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </span>
                    <span className={`shrink-0 ${typeColors[entry.type]}`}>
                      [{typeLabels[entry.type]}]
                    </span>
                    <span className="text-white">{entry.method}</span>
                  </div>
                  {formatParams(entry.params)}
                  <div className="ml-4 mt-0.5">
                    <span className="text-gray-500">→ </span>
                    <span className="text-emerald-400">{entry.result}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
