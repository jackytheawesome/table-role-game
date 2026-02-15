import { useState } from 'react'
import { Button, Card, Layout, Space, Typography } from 'antd'
import { PlayCircleOutlined } from '@ant-design/icons'
import { MapUploader } from '../components/MapUploader'
import { MapView } from '../components/MapView'
import { PlayersPanel } from '../components/PlayersPanel'
import { SkillCheckModal } from '../components/SkillCheckModal'
import { SkillChecksList } from '../components/SkillChecksList'
import { useGame } from '../context/GameContext'

export function SetupView() {
  const {
    mapImage,
    mapSize,
    players,
    skillChecks,
    revealedCells,
    setMap,
    setMode,
    addPlayer,
    removePlayer,
    addSkillCheck,
    removeSkillCheck,
  } = useGame()

  const [skillCheckModal, setSkillCheckModal] = useState<{
    open: boolean
    cell: { col: number; row: number } | null
  }>({ open: false, cell: null })

  const handleMapCellClick = (col: number, row: number) => {
    const existing = skillChecks.find(
      (sc) => Math.floor(sc.x) === col && Math.floor(sc.y) === row
    )
    if (!existing) {
      setSkillCheckModal({ open: true, cell: { col, row } })
    }
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
    <Layout className="setup-view">
      <Layout.Sider width={300} theme="light" style={{ padding: 16 }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <MapUploader
            onMapLoad={setMap}
            currentMap={mapImage}
            currentCols={mapSize.cols}
            currentRows={mapSize.rows}
          />
          <PlayersPanel
            players={players}
            onAddPlayer={addPlayer}
            onRemovePlayer={removePlayer}
          />
          <SkillChecksList
            skillChecks={skillChecks}
            onRemove={removeSkillCheck}
          />
          <Card>
            <Typography.Paragraph type="secondary">
              Нажмите на клетку карты, чтобы добавить точку проверки навыка.
            </Typography.Paragraph>
          </Card>
        </Space>
      </Layout.Sider>
      <Layout.Content style={{ padding: 24 }}>
        <div className="setup-main">
          {mapImage ? (
            <>
              <div className="map-container">
                <MapView
                  mapImage={mapImage}
                  cols={mapSize.cols}
                  rows={mapSize.rows}
                  skillChecks={skillChecks}
                  revealedCells={revealedCells}
                  isGameMode={false}
                  onMapClick={handleMapCellClick}
                />
              </div>
              <Button
                type="primary"
                size="large"
                icon={<PlayCircleOutlined />}
                onClick={() => setMode('game')}
                style={{ marginTop: 16 }}
              >
                Начать игру
              </Button>
            </>
          ) : (
            <Card className="empty-state">
              <Typography.Title level={4}>
                Загрузите карту, чтобы начать
              </Typography.Title>
              <Typography.Paragraph type="secondary">
                Используйте панель слева для загрузки карты, добавления игроков и
                расстановки точек проверки навыков.
              </Typography.Paragraph>
            </Card>
          )}
        </div>
      </Layout.Content>

      <SkillCheckModal
        open={skillCheckModal.open}
        cellPos={skillCheckModal.cell}
        onSave={handleSkillCheckSave}
        onCancel={() => setSkillCheckModal({ open: false, cell: null })}
      />
    </Layout>
  )
}
