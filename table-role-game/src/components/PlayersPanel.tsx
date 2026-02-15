import { useState } from 'react'
import { Button, Card, Input, List, Modal, Space, Tag } from 'antd'
import { PlusOutlined, UserOutlined } from '@ant-design/icons'
import type { Player } from '../types'

interface PlayersPanelProps {
  players: Player[]
  onAddPlayer: (name: string) => void
  onRemovePlayer: (id: string) => void
}

export function PlayersPanel({
  players,
  onAddPlayer,
  onRemovePlayer,
}: PlayersPanelProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [name, setName] = useState('')

  const handleAdd = () => {
    if (name.trim()) {
      onAddPlayer(name.trim())
      setName('')
      setModalOpen(false)
    }
  }

  return (
    <Card
      title={
        <Space>
          <UserOutlined />
          Игроки
        </Space>
      }
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalOpen(true)}
          block
        >
          Добавить игрока
        </Button>

        <List
          size="small"
          dataSource={players}
          renderItem={(player) => (
            <List.Item
              actions={[
                <Button
                  type="text"
                  danger
                  size="small"
                  key="remove"
                  onClick={() => onRemovePlayer(player.id)}
                >
                  Удалить
                </Button>,
              ]}
            >
              <Tag color={player.color}>{player.name}</Tag>
            </List.Item>
          )}
          locale={{ emptyText: 'Нет игроков' }}
        />
      </Space>

      <Modal
        title="Добавить игрока"
        open={modalOpen}
        onOk={handleAdd}
        onCancel={() => {
          setModalOpen(false)
          setName('')
        }}
        okText="Добавить"
        cancelText="Отмена"
      >
        <Input
          placeholder="Имя игрока"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onPressEnter={handleAdd}
          style={{ marginTop: 16 }}
        />
      </Modal>
    </Card>
  )
}
