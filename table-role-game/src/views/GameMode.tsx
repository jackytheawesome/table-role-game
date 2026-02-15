import { useState } from 'react'
import { Button } from 'antd'
import { ArrowLeftOutlined, CloseOutlined } from '@ant-design/icons'
import { useGame } from '../context/GameContext'
import { MapCanvas } from '../components/MapCanvas'
import type { SkillCheckPoint } from '../types'

/**
 * Figma 19-9348 — Оверлей проверки навыка в углу карты
 */
function SkillCheckOverlay({
  skillCheck,
  onClose,
}: {
  skillCheck: SkillCheckPoint | null
  onClose: () => void
}) {
  if (!skillCheck) return null
  return (
    <div className="skill-check-overlay">
      <div className="skill-check-overlay-content">
        <span>{skillCheck.skill} · КС {skillCheck.difficulty}</span>
        {skillCheck.description && (
          <div className="skill-check-overlay-note">{skillCheck.description}</div>
        )}
      </div>
      <button type="button" className="skill-check-overlay-close" onClick={onClose} aria-label="Закрыть">
        <CloseOutlined />
      </button>
    </div>
  )
}

/**
 * Figma Row 3: Fog of war — постепенное раскрытие карты по клеткам
 */
export function GameMode() {
  const {
    mapImage,
    mapSize,
    skillChecks,
    revealedCells,
    revealCell,
    setMode,
  } = useGame()

  const [pendingSkillCheck, setPendingSkillCheck] = useState<string | null>(null)

  const handleCellClick = (col: number, row: number) => {
    const key = `${col}-${row}`
    if (revealedCells.has(key)) return

    revealCell(col, row)

    const sc = skillChecks.find((s) => s.x === col && s.y === row)
    if (sc) setPendingSkillCheck(sc.id)
  }

  const skillCheck = pendingSkillCheck
    ? skillChecks.find((s) => s.id === pendingSkillCheck) ?? null
    : null

  if (!mapImage) {
    return (
      <div className="game-content">
        <Button onClick={() => setMode('setup')}>← Настройки</Button>
      </div>
    )
  }

  return (
    <>
      <div className="game-content game-content-with-overlay">
        <div className="game-header">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => setMode('setup')}
          >
            Выйти из игры
          </Button>
          <span>Кликните по клетке, чтобы открыть</span>
        </div>
        <MapCanvas
          mapImage={mapImage}
          cols={mapSize.cols}
          rows={mapSize.rows}
          skillChecks={skillChecks}
          revealedCells={revealedCells}
          isGameMode
          onCellClick={handleCellClick}
        />
        <SkillCheckOverlay
          skillCheck={skillCheck}
          onClose={() => setPendingSkillCheck(null)}
        />
      </div>
    </>
  )
}
