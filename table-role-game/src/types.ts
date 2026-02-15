export interface Player {
  id: string
  name: string
  color?: string
}

export interface SkillCheckPoint {
  id: string
  x: number
  y: number
  skill: string
  difficulty: number
  description?: string
  result?: 'passed' | 'failed' | null
}

export type AppMode = 'setup' | 'game'
