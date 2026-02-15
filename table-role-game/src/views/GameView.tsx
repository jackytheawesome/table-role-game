import { useState } from 'react'
import { Button, Layout, Typography } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { MapView } from '../components/MapView'
import { SkillCheckResultModal } from '../components/SkillCheckResultModal'
import { useGame } from '../context/GameContext'

export function GameView() {
  const {
    mapImage,
    mapSize,
    skillChecks,
    revealedCells,
    revealCell,
    updateSkillCheckResult,
    setMode,
  } = useGame()

  const [pendingSkillCheck, setPendingSkillCheck] = useState<{
    id: string
    col: number
    row: number
  } | null>(null)

  const handleCellClick = (col: number, row: number) => {
    const cellKey = `${col}-${row}`
    const alreadyRevealed = revealedCells.has(cellKey)

    if (!alreadyRevealed) {
      revealCell(col, row)

      const skillCheck = skillChecks.find(
        (sc) => Math.floor(sc.x) === col && Math.floor(sc.y) === row
      )

      if (skillCheck) {
        setPendingSkillCheck({ id: skillCheck.id, col, row })
      }
    }
  }

  const handleSkillCheckResult = (result: 'passed' | 'failed') => {
    if (pendingSkillCheck) {
      updateSkillCheckResult(pendingSkillCheck.id, result)
      setPendingSkillCheck(null)
    }
  }

  const skillCheckForModal = pendingSkillCheck
    ? skillChecks.find((sc) => sc.id === pendingSkillCheck.id) ?? null
    : null

  if (!mapImage) {
    return (
      <Layout style={{ minHeight: '100vh', padding: 24 }}>
        <Typography.Title>Нет загруженной карты</Typography.Title>
        <Button onClick={() => setMode('setup')}>Вернуться к настройкам</Button>
      </Layout>
    )
  }

  return (
    <Layout className="game-view" style={{ minHeight: '100vh' }}>
      <Layout.Header
        style={{
          background: '#fffef8',
          borderBottom: '1px solid #e8e4dc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
        }}
      >
        <Typography.Title level={4} style={{ margin: 0 }}>
          Режим игры — кликните по клетке, чтобы открыть
        </Typography.Title>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => setMode('setup')}
        >
          Выйти из игры
        </Button>
      </Layout.Header>
      <Layout.Content style={{ padding: 24, overflow: 'auto' }}>
        <div className="map-container game-mode">
          <MapView
            mapImage={mapImage}
            cols={mapSize.cols}
            rows={mapSize.rows}
            skillChecks={skillChecks}
            revealedCells={revealedCells}
            isGameMode
            onCellClick={handleCellClick}
          />
        </div>
      </Layout.Content>

      <SkillCheckResultModal
        open={!!pendingSkillCheck}
        skillCheck={skillCheckForModal}
        onResult={handleSkillCheckResult}
        onCancel={() => setPendingSkillCheck(null)}
      />
    </Layout>
  )
}
