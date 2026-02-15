import { useRef } from 'react'
import type { SkillCheckPoint } from '../types'

interface MapCanvasProps {
  mapImage: string
  cols: number
  rows: number
  skillChecks: SkillCheckPoint[]
  revealedCells: Set<string>
  isGameMode: boolean
  onCellClick: (col: number, row: number) => void
}

/**
 * Figma: Карта с сеткой, маркеры проверок, туман войны
 */
export function MapCanvas({
  mapImage,
  cols,
  rows,
  skillChecks,
  revealedCells,
  isGameMode,
  onCellClick,
}: MapCanvasProps) {
  const ref = useRef<HTMLDivElement>(null)

  const handleClick = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return

    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    const col = Math.floor(x * cols)
    const row = Math.floor(y * rows)

    if (col >= 0 && col < cols && row >= 0 && row < rows) {
      onCellClick(col, row)
    }
  }

  const getSkillCheck = (c: number, r: number) =>
    skillChecks.find((sc) => sc.x === c && sc.y === r)

  return (
    <div
      ref={ref}
      className="map-canvas"
      onClick={handleClick}
      style={{
        backgroundImage: `url(${mapImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: cols }).map((_, col) => {
          const key = `${col}-${row}`
          const revealed = revealedCells.has(key)
          const sc = getSkillCheck(col, row)

          return (
            <div
              key={key}
              className={`map-cell ${revealed ? 'revealed' : ''}`}
              onClick={(e) => {
                e.stopPropagation()
                onCellClick(col, row)
              }}
            >
              {isGameMode && !revealed && <div className="fog" />}
              {sc && revealed && sc.result && (
                <span className={`result-badge ${sc.result}`}>
                  {sc.result === 'passed' ? 'PASSED' : 'FAILED'}
                </span>
              )}
              {sc && (!isGameMode || (revealed && !sc.result)) && (
                <span className="marker marker-number">
                  {skillChecks.findIndex((s) => s.id === sc.id) + 1}
                </span>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}
