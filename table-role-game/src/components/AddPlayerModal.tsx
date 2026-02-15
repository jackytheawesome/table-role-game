import { useState } from 'react'
import { Input, InputNumber, Modal, Space } from 'antd'
import { useGame } from '../context/GameContext'

interface AddPlayerModalProps {
  open: boolean
  onClose: () => void
}

/**
 * Figma node 17:436 — Модалка «Добавление игрока»
 */
export function AddPlayerModal({ open, onClose }: AddPlayerModalProps) {
  const { addPlayer } = useGame()
  const [name, setName] = useState('')
  const [healthPoints, setHealthPoints] = useState(2)
  const [initiative, setInitiative] = useState(0)

  const handleAdd = () => {
    if (name.trim()) {
      addPlayer({
        name: name.trim().slice(0, 16),
        healthPoints,
        initiative,
      })
      setName('')
      setHealthPoints(2)
      setInitiative(0)
      onClose()
    }
  }

  const handleCancel = () => {
    setName('')
    setHealthPoints(2)
    setInitiative(0)
    onClose()
  }

  return (
    <Modal
      title="Добавление игрока"
      open={open}
      onOk={handleAdd}
      onCancel={handleCancel}
      okText="Добавить"
      destroyOnClose
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div>
          <div className="add-player-label">Имя игрока</div>
          <Input
            placeholder="Не более 16 символов"
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 16))}
            onPressEnter={handleAdd}
            maxLength={16}
          />
        </div>
        <Space wrap style={{ width: '100%' }}>
          <div>
            <div className="add-player-label">Очки здоровья</div>
            <InputNumber
              min={0}
              max={150}
              value={healthPoints}
              onChange={(v) => setHealthPoints(v ?? 0)}
              style={{ width: 120 }}
            />
          </div>
          <div>
            <div className="add-player-label">Инициатива</div>
            <InputNumber
              min={-20}
              max={20}
              value={initiative}
              onChange={(v) => setInitiative(v ?? 0)}
              style={{ width: 120 }}
            />
          </div>
        </Space>
      </Space>
    </Modal>
  )
}
