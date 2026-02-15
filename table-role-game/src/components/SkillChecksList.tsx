import { Button, Card, List, Tag } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import type { SkillCheckPoint } from '../types'

interface SkillChecksListProps {
  skillChecks: SkillCheckPoint[]
  onRemove: (id: string) => void
}

export function SkillChecksList({ skillChecks, onRemove }: SkillChecksListProps) {
  return (
    <Card title="Точки проверок навыков">
      <List
        size="small"
        dataSource={skillChecks}
        locale={{ emptyText: 'Кликните на карту, чтобы добавить' }}
        renderItem={(sc) => (
          <List.Item
            actions={[
              <Button
                type="text"
                danger
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => onRemove(sc.id)}
                key="remove"
              />,
            ]}
          >
            <div>
              <Tag color="cyan">{sc.skill}</Tag>
              <span style={{ marginLeft: 8 }}>DC {sc.difficulty}</span>
              <span style={{ color: '#999', marginLeft: 8 }}>
                ({sc.x + 1}, {sc.y + 1})
              </span>
            </div>
          </List.Item>
        )}
      />
    </Card>
  )
}
