import { createContext, useContext, useState, useCallback } from 'react'
import type { AppMode, Player, SkillCheckPoint } from '../types'

interface GameState {
  mode: AppMode
  mapImage: string | null
  mapSize: { cols: number; rows: number }
  players: Player[]
  skillChecks: SkillCheckPoint[]
  revealedCells: Set<string>
  uploadModalOpen: boolean
  addPlayerModalOpen: boolean
  selectingCellForCheck: boolean
}

interface GameContextType extends GameState {
  setMode: (mode: AppMode) => void
  setUploadModalOpen: (open: boolean) => void
  setAddPlayerModalOpen: (open: boolean) => void
  setSelectingCellForCheck: (selecting: boolean) => void
  setMap: (image: string, cols: number, rows: number) => void
  addPlayer: (data: {
    name: string
    healthPoints?: number
    initiative?: number
  }) => void
  removePlayer: (id: string) => void
  updatePlayer: (
    id: string,
    data: Partial<Pick<Player, 'healthPoints' | 'initiative' | 'initiativeRoll'>>
  ) => void
  rollInitiativeForAll: () => void
  clearInitiativeRolls: () => void
  addSkillCheck: (point: Omit<SkillCheckPoint, 'id'>) => void
  removeSkillCheck: (id: string) => void
  updateSkillCheckResult: (id: string, result: 'passed' | 'failed') => void
  revealCell: (col: number, row: number) => void
  resetGame: () => void
  resetMap: () => void
}

const STORAGE_KEY = 'table-role-game-state'

function loadPersistedState(): Partial<GameState> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    return {
      mapImage: data.mapImage ?? null,
      mapSize: data.mapSize ?? { cols: 10, rows: 8 },
      players: data.players ?? [],
      skillChecks: data.skillChecks ?? [],
      revealedCells: new Set(data.revealedCells ?? []),
    }
  } catch {
    return null
  }
}

function saveState(state: GameState) {
  try {
    const toSave = {
      mapImage: state.mapImage,
      mapSize: state.mapSize,
      players: state.players,
      skillChecks: state.skillChecks,
      revealedCells: Array.from(state.revealedCells),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  } catch {
    // ignore
  }
}

const defaultState: GameState = {
  mode: 'setup',
  mapImage: null,
  mapSize: { cols: 10, rows: 8 },
  players: [],
  skillChecks: [],
  revealedCells: new Set(),
  uploadModalOpen: false,
  addPlayerModalOpen: false,
  selectingCellForCheck: false,
}

const GameContext = createContext<GameContextType | null>(null)

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(() => {
    const persisted = loadPersistedState()
    if (!persisted) return defaultState
    return {
      ...defaultState,
      ...persisted,
    }
  })

  const setStateWithPersist = useCallback((updater: (s: GameState) => GameState) => {
    setState((s) => {
      const next = updater(s)
      saveState(next)
      return next
    })
  }, [])

  const setMode = useCallback((mode: AppMode) => {
    setStateWithPersist((s) => ({ ...s, mode }))
  }, [setStateWithPersist])

  const setUploadModalOpen = useCallback((open: boolean) => {
    setState((s) => ({ ...s, uploadModalOpen: open }))
  }, [])

  const setAddPlayerModalOpen = useCallback((open: boolean) => {
    setState((s) => ({ ...s, addPlayerModalOpen: open }))
  }, [])

  const setSelectingCellForCheck = useCallback((selecting: boolean) => {
    setState((s) => ({ ...s, selectingCellForCheck: selecting }))
  }, [])

  const setMap = useCallback((image: string, cols: number, rows: number) => {
    setStateWithPersist((s) => ({
      ...s,
      mapImage: image,
      mapSize: { cols, rows },
      revealedCells: new Set(),
    }))
  }, [setStateWithPersist])

  const addPlayer = useCallback(
    (data: { name: string; healthPoints?: number; initiative?: number }) => {
      const hp = Math.min(150, Math.max(0, data.healthPoints ?? 0))
      const init = Math.min(20, Math.max(-20, data.initiative ?? 0))
      const player: Player = {
        id: crypto.randomUUID(),
        name: data.name.slice(0, 16),
        healthPoints: hp,
        maxHealthPoints: hp,
        initiative: init,
        color: `hsl(${Math.random() * 360}, 60%, 55%)`,
      }
      setStateWithPersist((s) => ({ ...s, players: [...s.players, player] }))
    },
    [setStateWithPersist]
  )

  const removePlayer = useCallback((id: string) => {
    setStateWithPersist((s) => ({ ...s, players: s.players.filter((p) => p.id !== id) }))
  }, [setStateWithPersist])

  const updatePlayer = useCallback(
    (
      id: string,
      data: Partial<Pick<Player, 'healthPoints' | 'initiative' | 'initiativeRoll'>>
    ) => {
      setStateWithPersist((s) => ({
        ...s,
        players: s.players.map((p) =>
          p.id === id ? { ...p, ...data } : p
        ),
      }))
    },
    [setStateWithPersist]
  )

  const rollInitiativeForAll = useCallback(() => {
    setStateWithPersist((s) => ({
      ...s,
      players: s.players.map((p) => {
        const roll = Math.floor(Math.random() * 20) + 1
        return { ...p, initiativeRoll: roll }
      }),
    }))
  }, [setStateWithPersist])

  const clearInitiativeRolls = useCallback(() => {
    setStateWithPersist((s) => ({
      ...s,
      players: s.players.map((p) => ({ ...p, initiativeRoll: undefined })),
    }))
  }, [setStateWithPersist])

  const addSkillCheck = useCallback((point: Omit<SkillCheckPoint, 'id'>) => {
    const skillCheck: SkillCheckPoint = {
      ...point,
      id: crypto.randomUUID(),
    }
    setStateWithPersist((s) => ({ ...s, skillChecks: [...s.skillChecks, skillCheck] }))
  }, [setStateWithPersist])

  const removeSkillCheck = useCallback((id: string) => {
    setStateWithPersist((s) => ({
      ...s,
      skillChecks: s.skillChecks.filter((sc) => sc.id !== id),
    }))
  }, [setStateWithPersist])

  const updateSkillCheckResult = useCallback(
    (id: string, result: 'passed' | 'failed') => {
      setStateWithPersist((s) => ({
        ...s,
        skillChecks: s.skillChecks.map((sc) =>
          sc.id === id ? { ...sc, result } : sc
        ),
      }))
    },
    [setStateWithPersist]
  )

  const revealCell = useCallback((col: number, row: number) => {
    const key = `${col}-${row}`
    setStateWithPersist((s) => ({
      ...s,
      revealedCells: new Set([...s.revealedCells, key]),
    }))
  }, [setStateWithPersist])

  const resetMap = useCallback(() => {
    setStateWithPersist((s) => ({
      ...s,
      mapImage: null,
      mapSize: { cols: 10, rows: 8 },
      skillChecks: [],
      revealedCells: new Set(),
    }))
  }, [setStateWithPersist])

  const resetGame = useCallback(() => {
    setState(defaultState)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const value: GameContextType = {
    ...state,
    setMode,
    setUploadModalOpen,
    setAddPlayerModalOpen,
    setSelectingCellForCheck,
    setMap,
    addPlayer,
    removePlayer,
    updatePlayer,
    addSkillCheck,
    removeSkillCheck,
    updateSkillCheckResult,
    rollInitiativeForAll,
    clearInitiativeRolls,
    revealCell,
    resetGame,
    resetMap,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within GameProvider')
  return ctx
}
