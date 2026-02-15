import { createContext, useContext, useState, useCallback } from 'react'
import type { AppMode, Player, SkillCheckPoint } from '../types'

interface GameState {
  mode: AppMode
  mapImage: string | null
  mapSize: { cols: number; rows: number }
  players: Player[]
  skillChecks: SkillCheckPoint[]
  revealedCells: Set<string>
}

interface GameContextType extends GameState {
  setMode: (mode: AppMode) => void
  setMap: (image: string, cols: number, rows: number) => void
  addPlayer: (name: string) => void
  removePlayer: (id: string) => void
  addSkillCheck: (point: Omit<SkillCheckPoint, 'id'>) => void
  removeSkillCheck: (id: string) => void
  updateSkillCheckResult: (id: string, result: 'passed' | 'failed') => void
  revealCell: (col: number, row: number) => void
  resetGame: () => void
}

const defaultState: GameState = {
  mode: 'setup',
  mapImage: null,
  mapSize: { cols: 10, rows: 8 },
  players: [],
  skillChecks: [],
  revealedCells: new Set(),
}

const GameContext = createContext<GameContextType | null>(null)

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(defaultState)

  const setMode = useCallback((mode: AppMode) => {
    setState((s) => ({ ...s, mode }))
  }, [])

  const setMap = useCallback((image: string, cols: number, rows: number) => {
    setState((s) => ({
      ...s,
      mapImage: image,
      mapSize: { cols, rows },
      revealedCells: new Set(),
    }))
  }, [])

  const addPlayer = useCallback((name: string) => {
    const player: Player = {
      id: crypto.randomUUID(),
      name,
      color: `hsl(${Math.random() * 360}, 60%, 55%)`,
    }
    setState((s) => ({ ...s, players: [...s.players, player] }))
  }, [])

  const removePlayer = useCallback((id: string) => {
    setState((s) => ({ ...s, players: s.players.filter((p) => p.id !== id) }))
  }, [])

  const addSkillCheck = useCallback((point: Omit<SkillCheckPoint, 'id'>) => {
    const skillCheck: SkillCheckPoint = {
      ...point,
      id: crypto.randomUUID(),
    }
    setState((s) => ({ ...s, skillChecks: [...s.skillChecks, skillCheck] }))
  }, [])

  const removeSkillCheck = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      skillChecks: s.skillChecks.filter((sc) => sc.id !== id),
    }))
  }, [])

  const updateSkillCheckResult = useCallback(
    (id: string, result: 'passed' | 'failed') => {
      setState((s) => ({
        ...s,
        skillChecks: s.skillChecks.map((sc) =>
          sc.id === id ? { ...sc, result } : sc
        ),
      }))
    },
    []
  )

  const revealCell = useCallback((col: number, row: number) => {
    const key = `${col}-${row}`
    setState((s) => ({
      ...s,
      revealedCells: new Set([...s.revealedCells, key]),
    }))
  }, [])

  const resetGame = useCallback(() => {
    setState(defaultState)
  }, [])

  const value: GameContextType = {
    ...state,
    setMode,
    setMap,
    addPlayer,
    removePlayer,
    addSkillCheck,
    removeSkillCheck,
    updateSkillCheckResult,
    revealCell,
    resetGame,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within GameProvider')
  return ctx
}
