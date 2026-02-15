import { Button, Modal, Space, Typography } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import type { SkillCheckPoint } from '../types'

interface SkillCheckResultModalProps {
  open: boolean
  skillCheck: SkillCheckPoint | null
  onResult: (result: 'passed' | 'failed') => void
  onCancel: () => void
}

export function SkillCheckResultModal({
  open,
  skillCheck,
  onResult,
  onCancel,
}: SkillCheckResultModalProps) {
  if (!skillCheck) return null

  return (
    <Modal
      title={`Проверка: ${skillCheck.skill} (DC ${skillCheck.difficulty})`}
      open={open}
      onCancel={onCancel}
      footer={null}
    >
      {skillCheck.description && (
        <Typography.Paragraph style={{ marginBottom: 24 }}>
          {skillCheck.description}
        </Typography.Paragraph>
      )}
      <Space size="large" style={{ width: '100%', justifyContent: 'center' }}>
        <Button
          type="primary"
          icon={<CheckCircleOutlined />}
          size="large"
          onClick={() => {
            onResult('passed')
            onCancel()
          }}
        >
          Прошёл
        </Button>
        <Button
          danger
          icon={<CloseCircleOutlined />}
          size="large"
          onClick={() => {
            onResult('failed')
            onCancel()
          }}
        >
          Провалил
        </Button>
      </Space>
    </Modal>
  )
}
