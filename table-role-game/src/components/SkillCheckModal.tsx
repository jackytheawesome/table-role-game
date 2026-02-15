import { useState } from 'react'
import { Input, InputNumber, Modal, Select, Space } from 'antd'

const SKILL_OPTIONS = [
  'Сила',
  'Ловкость',
  'Телосложение',
  'Интеллект',
  'Мудрость',
  'Харизма',
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
  checkNumber: number
  cellPos?: { col: number; row: number } | null
  onSave: (data: {
    skill: string
    difficulty: number
    description?: string
  }) => void
  onCancel: () => void
}

/**
 * Figma 19-6282, 19-6577 — Добавление проверки: Что проверяем, Класс сложности
 */
export function SkillCheckModal({
  open,
  checkNumber,
  onSave,
  onCancel,
}: SkillCheckModalProps) {
  const [skill, setSkill] = useState<string>('')
  const [difficulty, setDifficulty] = useState(1)
  const [note, setNote] = useState<string>('')

  const handleSave = () => {
    if (skill) {
      onSave({ skill, difficulty, description: note.trim() || undefined })
      setSkill('')
      setDifficulty(1)
      setNote('')
    }
  }

  const handleCancel = () => {
    onCancel()
    setSkill('')
    setDifficulty(1)
    setNote('')
  }

  return (
    <Modal
      title={`Добавление проверки "${checkNumber}"`}
      open={open}
      onOk={handleSave}
      onCancel={handleCancel}
      okText="Добавить"
      cancelButtonProps={{ style: { display: 'none' } }}
      okButtonProps={{ disabled: !skill }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <div>
          <div className="add-check-label">Что проверяем</div>
          <Select
            placeholder="Название навыка"
            value={skill || undefined}
            onChange={setSkill}
            options={SKILL_OPTIONS.map((s) => ({ label: s, value: s }))}
            style={{ width: '100%', marginTop: 8 }}
          />
        </div>
        <div>
          <div className="add-check-label">Класс сложности</div>
          <InputNumber
            min={1}
            max={20}
            value={difficulty}
            onChange={(v) => setDifficulty(v ?? 1)}
            style={{ width: '100%', marginTop: 8 }}
          />
        </div>
        <div>
          <div className="add-check-label">Заметка для мастера</div>
          <Input.TextArea
            placeholder="Описание проверки, подсказки..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            style={{ width: '100%', marginTop: 8 }}
          />
        </div>
      </Space>
    </Modal>
  )
}
