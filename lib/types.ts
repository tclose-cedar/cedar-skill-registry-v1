export type SkillSource = 'marco' | 'rootstock' | 'cm-ops' | 'kora-sierra'
export type UserRole = 'general' | 'admin'

export interface Skill {
  id: string
  name: string
  description: string
  source: SkillSource
  function: string
  role: string[]
  tags: string[]
  status: 'published' | 'draft' | 'in-review' | 'archived'
  requiredTools: string[]
  requiredContext: string[]
  author: string
  createdAt: string
  updatedAt: string
  usageCount: number
  content?: string
}

export interface CommandLogEntry {
  id: string
  timestamp: string
  method: string
  params: Record<string, unknown>
  result: string
  type: 'api' | 'webhook' | 'ci'
}
