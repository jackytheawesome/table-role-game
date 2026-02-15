import { useRef } from 'react'
import type { SkillCheckPoint } from '../types'

interface MapViewProps {
  mapImage: string
  cols: number
  rows: number
  skillChecks: SkillCheckPoint[]
  revealedCells: Set<string>
  isGameMode: boolean
  onCellClick?: (col: number, row: number) => void
  onMapClick?: (col: number, row: number) => void
}

export function MapView({
  mapImage,
  cols,
  rows,
  skillChecks,
  revealedCells,
  isGameMode,
  onCellClick,
  onMapClick,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect || !onMapClick) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cellWidth = rect.width / cols
    const cellHeight = rect.height / rows

    const col = Math.floor(x / cellWidth)
    const row = Math.floor(y / cellHeight)

    if (col >= 0 && col < cols && row >= 0 && row < rows) {
      if (isGameMode && onCellClick) {
        onCellClick(col, row)
      } else if (!isGameMode && onMapClick) {
        onMapClick(col, row)
      }
    }
  }

  const getSkillCheckAtCell = (col: number, row: number) =>
    skillChecks.find(
      (sc) => Math.floor(sc.x) === col && Math.floor(sc.y) === row
    )

  return (
    <div
      ref={containerRef}
      className="map-view"
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
          const cellKey = `${col}-${row}`
          const isRevealed = revealedCells.has(cellKey)
          const skillCheck = getSkillCheckAtCell(col, row)

          return (
            <div
              key={cellKey}
              className={`map-cell ${isRevealed ? 'revealed' : ''} ${
                skillCheck ? 'has-skill-check' : ''
              }`}
              onClick={(e) => {
                e.stopPropagation()
                if (isGameMode && onCellClick) {
                  onCellClick(col, row)
                } else if (!isGameMode && onMapClick) {
                  onMapClick(col, row)
                }
              }}
            >
              {isGameMode && !isRevealed && (
                <div className="fog-cell" />
              )}
              {skillCheck && isRevealed && skillCheck.result && (
                <span
                  className={`skill-result ${
                    skillCheck.result === 'passed' ? 'passed' : 'failed'
                  }`}
                >
                  {skillCheck.result === 'passed' ? 'PASSED' : 'FAILED'}
                </span>
              )}
              {skillCheck && !isGameMode && (
                <span className="skill-marker">✓</span>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}
