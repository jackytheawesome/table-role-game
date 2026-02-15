import { useState } from 'react'
import { Button } from 'antd'
import { useGame } from '../context/GameContext'
import { MapCanvas } from '../components/MapCanvas'
import { UploadMapModal } from '../components/UploadMapModal'
import { AddPlayerModal } from '../components/AddPlayerModal'
import { SkillCheckModal } from '../components/SkillCheckModal'

/**
 * Figma node 19:4504 — Основная область: кнопка "Загрузить карту" по центру
 */
export function SetupMode() {
  const {
    mapImage,
    mapSize,
    skillChecks,
    revealedCells,
    selectingCellForCheck,
    uploadModalOpen,
    addPlayerModalOpen,
    setUploadModalOpen,
    setAddPlayerModalOpen,
    setSelectingCellForCheck,
    addSkillCheck,
  } = useGame()

  const [skillCheckModal, setSkillCheckModal] = useState<{
    open: boolean
    cell: { col: number; row: number } | null
  }>({ open: false, cell: null })
  const [mapUploading, setMapUploading] = useState(false)

  const handleMapClick = (col: number, row: number) => {
    if (selectingCellForCheck) setSelectingCellForCheck(false)
    const exists = skillChecks.some((sc) => sc.x === col && sc.y === row)
    if (!exists) setSkillCheckModal({ open: true, cell: { col, row } })
  }

  const handleSkillCheckSave = (data: {
    skill: string
    difficulty: number
    description?: string
  }) => {
    if (skillCheckModal.cell) {
      addSkillCheck({
        x: skillCheckModal.cell.col,
        y: skillCheckModal.cell.row,
        ...data,
      })
      setSkillCheckModal({ open: false, cell: null })
    }
  }

  return (
    <>
      <div className="main-content">
        {!mapImage ? (
          <div className="load-map-area">
            <Button
              className="load-map-btn"
              onClick={() => setUploadModalOpen(true)}
            >
              Загрузить карту
            </Button>
          </div>
        ) : mapUploading ? (
          <div className="map-loading">Загрузка...</div>
        ) : (
          <>
            {selectingCellForCheck && (
              <div className="select-cell-hint">
                Выберите клетку на карте для добавления проверки
              </div>
            )}
            <MapCanvas
            mapImage={mapImage}
            cols={mapSize.cols}
            rows={mapSize.rows}
            skillChecks={skillChecks}
            revealedCells={revealedCells}
            isGameMode={false}
              onCellClick={handleMapClick}
            />
          </>
        )}
      </div>

      <UploadMapModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUploadStart={() => setMapUploading(true)}
        onUploadComplete={() => setMapUploading(false)}
      />

      <AddPlayerModal
        open={addPlayerModalOpen}
        onClose={() => setAddPlayerModalOpen(false)}
      />

      <SkillCheckModal
        open={skillCheckModal.open}
        checkNumber={skillChecks.length + 1}
        cellPos={skillCheckModal.cell}
        onSave={handleSkillCheckSave}
        onCancel={() => setSkillCheckModal({ open: false, cell: null })}
      />
    </>
  )
}
