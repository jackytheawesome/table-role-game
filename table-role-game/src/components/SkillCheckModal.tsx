import { useState } from 'react'
import { Input, InputNumber, Modal, Select, Space } from 'antd'

const SKILL_OPTIONS = [
  'Атлетика',
  'Акробатика',
  'Ловкость рук',
  'Скрытность',
  'Аркана',
  'История',
  'Расследование',
  'Природа',
  'Религия',
  'Внимательность',
  'Выживание',
  'Медицина',
  'Уход за животными',
  'Проницательность',
  'Выступление',
  'Запугивание',
  'Обман',
  'Убеждение',
]

interface SkillCheckModalProps {
  open: boolean
  cellPos: { col: number; row: number } | null
  onSave: (data: {
    skill: string
    difficulty: number
    description?: string
  }) => void
  onCancel: () => void
}

export function SkillCheckModal({
  open,
  cellPos,
  onSave,
  onCancel,
}: SkillCheckModalProps) {
  const [skill, setSkill] = useState<string>('')
  const [difficulty, setDifficulty] = useState(10)
  const [description, setDescription] = useState('')

  const handleSave = () => {
    if (skill) {
      onSave({ skill, difficulty, description: description || undefined })
      setSkill('')
      setDifficulty(10)
      setDescription('')
    }
  }

  return (
    <Modal
      title={
        cellPos
          ? `Точка проверки навыка (${cellPos.col + 1}, ${cellPos.row + 1})`
          : 'Точка проверки навыка'
      }
      open={open}
      onOk={handleSave}
      onCancel={() => {
        onCancel()
        setSkill('')
        setDifficulty(10)
        setDescription('')
      }}
      okText="Добавить"
      cancelText="Отмена"
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <div>
          <label>Навык</label>
          <Select
            placeholder="Выберите навык"
            value={skill || undefined}
            onChange={setSkill}
            options={SKILL_OPTIONS.map((s) => ({ label: s, value: s }))}
            style={{ width: '100%', marginTop: 8 }}
          />
        </div>
        <div>
          <label>Сложность (DC)</label>
          <InputNumber
            min={5}
            max={30}
            value={difficulty}
            onChange={(v) => setDifficulty(v ?? 10)}
            style={{ width: '100%', marginTop: 8 }}
          />
        </div>
        <div>
          <label>Описание (опционально)</label>
          <Input.TextArea
            placeholder="Что происходит при успехе/провале?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{ marginTop: 8 }}
          />
        </div>
      </Space>
    </Modal>
  )
}
