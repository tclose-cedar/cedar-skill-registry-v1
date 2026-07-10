import { CommandLogEntry } from './types'

type LogCallback = (entry: CommandLogEntry) => void

let logCallback: LogCallback | null = null

export function setLogCallback(cb: LogCallback) {
  logCallback = cb
}

function log(method: string, params: Record<string, unknown>, result: string, type: CommandLogEntry['type'] = 'api') {
  const entry: CommandLogEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
    method,
    params,
    result,
    type,
  }
  logCallback?.(entry)
  return entry
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function mockInstallSkills(skillIds: string[], skillNames: string[], role: string): Promise<string> {
  const manifestId = Math.random().toString(36).slice(2, 9)
  const manifestUrl = `https://skill-registry.cedar.internal/api/manifests/${manifestId}`

  await delay(300)
  log('registry.generateManifest', {
    role,
    skill_count: skillIds.length,
    skills: skillIds.join(', '),
  }, `✓ Plugin manifest generated (${skillIds.length} skills for ${role})`)

  await delay(200)
  log('registry.saveManifest', {
    manifest_id: manifestId,
    url: manifestUrl,
    ttl: '24h',
  }, `✓ Manifest cached at ${manifestUrl}`)

  await delay(150)
  log('claude://install', {
    url: manifestUrl,
    action: 'deep link fired → Claude Desktop opens install dialog',
  }, `✓ Install dialog opened in Claude Desktop`, 'webhook')

  return manifestUrl
}
