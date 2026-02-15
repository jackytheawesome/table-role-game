import { useRef, useState } from 'react'
import { InputNumber, Modal } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useGame } from '../context/GameContext'

interface UploadMapModalProps {
  open: boolean
  onClose: () => void
  onUploadStart: () => void
  onUploadComplete: () => void
}

/**
 * Figma: Модалка загрузки карты — поле выбора файла, настройки сетки
 */
export function UploadMapModal({
  open,
  onClose,
  onUploadStart,
  onUploadComplete,
}: UploadMapModalProps) {
  const { setMap } = useGame()
  const [cols, setCols] = useState(10)
  const [rows, setRows] = useState(8)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    onUploadStart()
    const reader = new FileReader()
    reader.onload = () => {
      setMap(reader.result as string, cols, rows)
      onUploadComplete()
      onClose()
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  return (
    <Modal
      title="Загрузить карту"
      open={open}
      onCancel={onClose}
      footer={null}
    >
      <div className="upload-modal">
        <div
          className="upload-zone"
          onClick={() => inputRef.current?.click()}
        >
          <UploadOutlined />
          <p>Нажмите или перетащите файл</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          style={{ display: 'none' }}
        />
        <div className="grid-settings">
          <label>Сетка</label>
          <div className="grid-inputs">
            <InputNumber
              min={4}
              max={20}
              value={cols}
              onChange={(v) => setCols(v ?? 10)}
              addonBefore="Колонок"
            />
            <InputNumber
              min={4}
              max={20}
              value={rows}
              onChange={(v) => setRows(v ?? 8)}
              addonBefore="Строк"
            />
          </div>
        </div>
      </div>
    </Modal>
  )
}
