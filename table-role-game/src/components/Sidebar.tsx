import {
  Layout,
  Select,
  InputNumber,
  Button,
  Typography,
  Space,
  Popconfirm,
  Tooltip,
} from 'antd'
import {
  ThunderboltOutlined,
  PlayCircleOutlined,
  DeleteOutlined,
  HeartFilled,
  QuestionCircleOutlined,
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
}: {
  player: Player
  onRemove: () => void
  onUpdate: (data: Partial<Pick<Player, 'healthPoints' | 'initiative' | 'initiativeRoll'>>) => void
  isGameMode?: boolean
}) {
  const hp = player.healthPoints ?? 0
  const init = player.initiative ?? 0
  const initRoll = player.initiativeRoll

  return (
    <div className="player-card">
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
            value={hp}
            onChange={(v) => onUpdate({ healthPoints: v ?? 0 })}
            controls={false}
            bordered={false}
            className="hp-input"
          />
        </span>
        <div className="init-field">
          <span className="init-prefix">Ин. {init >= 0 ? '+' : ''}</span>
          <InputNumber
            size="small"
            value={init}
            onChange={(v) => onUpdate({ initiative: v ?? 0 })}
            controls={false}
            className="init-input"
          />
        </div>
        {isGameMode && initRoll != null && (
          <InputNumber
            size="small"
            value={initRoll}
            onChange={(v) => onUpdate({ initiativeRoll: v ?? undefined })}
            controls={false}
            className="init-roll-input"
            min={1}
            max={20}
          />
        )}
        <Tooltip title={`Игрок: ${player.name} | HP: ${hp} | Инициатива: ${init >= 0 ? '+' : ''}${init}`}>
          <Button
            type="text"
            size="small"
            icon={<QuestionCircleOutlined />}
            className="player-info-btn"
            aria-label="Информация об игроке"
          />
        </Tooltip>
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
  const [diceCount, setDiceCount] = useState(3)
  const [diceType, setDiceType] = useState('d100')
  const [modifier, setModifier] = useState(2)
  const [rollResult, setRollResult] = useState<{ sum: number; total: number } | null>(null)

  const rollDice = () => {
    const match = diceType.match(/d(\d+)/)
    const sides = match ? parseInt(match[1], 10) : 6
    let sum = 0
    for (let i = 0; i < diceCount; i++) {
      sum += Math.floor(Math.random() * sides) + 1
    }
    setRollResult({ sum, total: sum + modifier })
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
                max={20}
                value={diceCount}
                onChange={(v) => setDiceCount(v ?? 1)}
                style={{ width: 64 }}
              />
            </div>
            <div>
              <div className="field-label">Какой</div>
              <Select
                value={diceType}
                onChange={setDiceType}
                options={DICE_OPTIONS.map((d) => ({ value: d, label: d }))}
                style={{ width: 80 }}
              />
            </div>
            <div>
              <div className="field-label">Модификат</div>
              <InputNumber
                value={modifier}
                onChange={(v) => setModifier(v ?? 0)}
                style={{ width: 64 }}
              />
            </div>
          </Space>
          <div className="result-area">
            <div className="result-label">Результат</div>
            {rollResult !== null ? (
              <div className="result-value">
                {rollResult.sum}+{modifier}={rollResult.total}
              </div>
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
              {sortedPlayers.map((p) => (
                <PlayerCard
                  key={p.id}
                  player={p}
                  onRemove={() => removePlayer(p.id)}
                  onUpdate={(data) => updatePlayer(p.id, data)}
                  isGameMode={isGameMode}
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
                    <span>{i + 1}. {sc.skill} + КС {sc.difficulty}</span>
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
          </div>
        )}
      </div>
    </Layout.Sider>
  )
}
