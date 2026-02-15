import {
  Layout,
  Select,
  InputNumber,
  Button,
  Typography,
  Space,
  Popconfirm,
} from 'antd'
import {
  ThunderboltOutlined,
  PlayCircleOutlined,
  DeleteOutlined,
  HeartFilled,
} from '@ant-design/icons'
import { useState } from 'react'
import { useGame } from '../context/GameContext'
import type { Player } from '../types'

const DICE_OPTIONS = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100']

/**
 * Figma node 17:320 — Карточка игрока: имя, HP, инициатива, удаление
 */
function PlayerCard({
  player,
  onRemove,
  onUpdate,
  isGameMode,
  isCurrentTurn,
}: {
  player: Player
  onRemove: () => void
  onUpdate: (data: Partial<Pick<Player, 'healthPoints' | 'initiativeRoll'>>) => void
  isGameMode?: boolean
  isCurrentTurn?: boolean
}) {
  const hp = player.healthPoints ?? 0
  const maxHp = Math.min(150, player.maxHealthPoints ?? hp)
  const init = player.initiative ?? 0
  const initRoll = player.initiativeRoll

  return (
    <div className={`player-card ${isCurrentTurn ? 'player-card-current-turn' : ''}`}>
      <div className="player-card-header">
        <span className="player-name">{player.name}</span>
        <Popconfirm
          title="Удалить игрока?"
          onConfirm={onRemove}
          okText="Да"
          cancelText="Нет"
        >
          <button type="button" className="player-delete-btn">
            <DeleteOutlined />
          </button>
        </Popconfirm>
      </div>
      <div className="player-card-stats">
        <span className="player-hp">
          <HeartFilled style={{ color: '#ff4d4f', marginRight: 4 }} />
          <InputNumber
            size="small"
            min={0}
            max={maxHp}
            value={hp}
            onChange={(v) => {
              const val = v ?? 0
              onUpdate({ healthPoints: Math.min(Math.max(0, val), maxHp) })
            }}
            parser={(v) => Math.min(Math.max(0, Number(v) || 0), maxHp)}
            controls={false}
            bordered={false}
            className="hp-input"
          />
        </span>
        <span className="init-display">
          Ин.{init >= 0 ? '+' : ''}{init}
        </span>
        {isGameMode && initRoll != null && (
          <span className="init-roll-display">
            {initRoll}<span className="init-roll-modifier">{init >= 0 ? '+' : ''}{init}</span>
          </span>
        )}
      </div>
    </div>
  )
}

/**
 * Figma node 19:4504 — Левая панель
 */
export function Sidebar() {
  const {
    mode,
    players,
    mapImage,
    skillChecks,
    setMode,
    setAddPlayerModalOpen,
    setSelectingCellForCheck,
    removePlayer,
    updatePlayer,
    removeSkillCheck,
    rollInitiativeForAll,
    clearInitiativeRolls,
    resetMap,
  } = useGame()
  const isGameMode = mode === 'game'
  const hasInitiativeRolls = players.some((p) => p.initiativeRoll != null)
  const sortedPlayers = isGameMode && hasInitiativeRolls
    ? [...players].sort(
        (a, b) =>
          ((b.initiativeRoll ?? 0) + (b.initiative ?? 0)) -
          ((a.initiativeRoll ?? 0) + (a.initiative ?? 0))
      )
    : players
  const [dicePlayer, setDicePlayer] = useState<string | null>(null)
  const [diceCount, setDiceCount] = useState(1)
  const [diceType, setDiceType] = useState('d20')
  const [modifier, setModifier] = useState(0)
  const [rollResult, setRollResult] = useState<{ rolls: number[]; modifier: number } | null>(null)

  const effectiveDiceCount = diceType === 'd100' ? 1 : diceCount
  const diceCountMax = diceType === 'd100' ? 1 : 20

  const rollDice = () => {
    const match = diceType.match(/d(\d+)/)
    const sides = match ? parseInt(match[1], 10) : 6
    const count = diceType === 'd100' ? 1 : diceCount
    const rolls: number[] = []
    for (let i = 0; i < count; i++) {
      rolls.push(Math.floor(Math.random() * sides) + 1)
    }
    setRollResult({ rolls, modifier })
  }

  const formatDieValue = (value: number) => {
    if (diceType === 'd20') {
      if (value === 1) return '💢 1'
      if (value === 20) return '✨ 20'
    }
    return String(value)
  }

  const formatRollResult = () => {
    if (!rollResult) return null
    const { rolls, modifier } = rollResult
    const parts = rolls.map(formatDieValue)
    const total = rolls.reduce((a, b) => a + b, 0) + modifier
    const modifierStr = modifier > 0 ? ` + ${modifier}` : modifier < 0 ? ` - ${Math.abs(modifier)}` : ''
    return <>{parts.join(' + ')}{modifierStr} = {total}</>
  }

  return (
    <Layout.Sider width={320} className="master-sidebar">
      <div className="sidebar-inner">
        <div className="sidebar-section">
          <Select
            className="mode-select"
            value={isGameMode ? 'game' : 'master'}
            onChange={(v) => setMode(v === 'game' ? 'game' : 'setup')}
            options={[
              { value: 'master', label: 'Режим мастера' },
              ...(mapImage ? [{ value: 'game' as const, label: 'Игра' }] : []),
            ]}
            style={{ width: '100%' }}
          />
        </div>

        {isGameMode && (
        <div className="sidebar-section">
          <Typography.Title level={5} className="section-title">
            Проверки и бой
          </Typography.Title>
          <Select
            placeholder="Кто бросает кубик"
            value={dicePlayer}
            onChange={setDicePlayer}
            allowClear
            options={players.map((p) => ({ value: p.id, label: p.name }))}
            style={{ width: '100%', marginBottom: 12 }}
          />
          <Space wrap style={{ marginBottom: 12 }}>
            <div>
              <div className="field-label">Сколько</div>
              <InputNumber
                min={1}
                max={diceCountMax}
                value={effectiveDiceCount}
                onChange={(v) => {
                  if (diceType !== 'd100') setDiceCount(v ?? 1)
                }}
                style={{ width: 64 }}
              />
            </div>
            <div>
              <div className="field-label">Какой</div>
              <Select
                value={diceType}
                onChange={(v) => {
                  setDiceType(v)
                  if (v === 'd100') setDiceCount(1)
                }}
                options={DICE_OPTIONS.map((d) => ({ value: d, label: d }))}
                style={{ width: 80 }}
              />
            </div>
            <div>
              <div className="field-label">Модификат</div>
              <InputNumber
                value={modifier}
                onChange={(v) => setModifier(v ?? 0)}
                min={-20}
                max={20}
                style={{ width: 64 }}
              />
            </div>
          </Space>
          <div className="result-area">
            <div className="result-label">Результат</div>
            {rollResult !== null ? (
              <div className="result-value">{formatRollResult()}</div>
            ) : (
              <ThunderboltOutlined className="result-icon" />
            )}
          </div>
          <Button type="primary" block onClick={rollDice} style={{ marginTop: 12 }}>
            Бросить
          </Button>
        </div>
        )}

        <div className="sidebar-section">
          <div className="section-header">
            <Typography.Title level={5} className="section-title">
              Игроки
            </Typography.Title>
            <a onClick={() => setAddPlayerModalOpen(true)}>Добавить</a>
          </div>
          {players.length === 0 ? (
            <Typography.Text type="secondary">—</Typography.Text>
          ) : (
            <div className="players-cards">
              {sortedPlayers.map((p, idx) => (
                <PlayerCard
                  key={p.id}
                  player={p}
                  onRemove={() => removePlayer(p.id)}
                  onUpdate={(data) => updatePlayer(p.id, data)}
                  isGameMode={isGameMode}
                  isCurrentTurn={isGameMode && hasInitiativeRolls && idx === 0}
                />
              ))}
            </div>
          )}
          {isGameMode && (
            <Button
              block
              onClick={hasInitiativeRolls ? clearInitiativeRolls : rollInitiativeForAll}
              style={{ marginTop: 12 }}
            >
              {hasInitiativeRolls ? 'Очистить результаты' : 'Бросок инициативы'}
            </Button>
          )}
        </div>

        {mapImage && !isGameMode && (
          <div className="sidebar-section">
            <div className="section-header">
              <Typography.Title level={5} className="section-title">
                Проверки
              </Typography.Title>
              <a onClick={() => setSelectingCellForCheck(true)}>Добавить</a>
            </div>
            {skillChecks.length === 0 ? (
              <Typography.Text type="secondary">—</Typography.Text>
            ) : (
              <ul className="checks-list">
                {skillChecks.map((sc, i) => (
                  <li key={sc.id} className="check-item">
                    <div className="check-item-content">
                      <span>{i + 1}. {sc.skill} + КС {sc.difficulty}</span>
                      {sc.description && (
                        <div className="check-item-note">{sc.description}</div>
                      )}
                    </div>
                    <Popconfirm
                      title="Удалить проверку?"
                      onConfirm={() => removeSkillCheck(sc.id)}
                      okText="Да"
                      cancelText="Нет"
                    >
                      <button type="button" className="check-delete-btn">
                        <DeleteOutlined />
                      </button>
                    </Popconfirm>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {mapImage && !isGameMode && (
          <div className="sidebar-section">
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              block
              onClick={() => setMode('game')}
            >
              Начать игру
            </Button>
            <Popconfirm
              title="Сбросить карту и все проверки?"
              onConfirm={resetMap}
              okText="Да"
              cancelText="Нет"
            >
              <Button block style={{ marginTop: 8 }}>
                Сбросить карту
              </Button>
            </Popconfirm>
          </div>
        )}
      </div>
    </Layout.Sider>
  )
}
