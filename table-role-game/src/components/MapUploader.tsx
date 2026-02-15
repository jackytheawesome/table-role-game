import { useRef, useState } from 'react'
import { Button, InputNumber, Card, Space, Image } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

interface MapUploaderProps {
  onMapLoad: (image: string, cols: number, rows: number) => void
  currentMap?: string | null
  currentCols?: number
  currentRows?: number
}

export function MapUploader({
  onMapLoad,
  currentMap,
  currentCols = 10,
  currentRows = 8,
}: MapUploaderProps) {
  const [cols, setCols] = useState(currentCols)
  const [rows, setRows] = useState(currentRows)
  const [preview, setPreview] = useState<string | null>(currentMap ?? null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setPreview(result)
      onMapLoad(result, cols, rows)
    }
    reader.readAsDataURL(file)
  }

  const handleApplyGrid = () => {
    if (preview) {
      onMapLoad(preview, cols, rows)
    }
  }

  return (
    <Card title="Карта" className="map-uploader-card">
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <div className="upload-area">
          <input
            ref={fileInputRef}
            id="map-file-input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <Button
            type="primary"
            icon={<UploadOutlined />}
            onClick={() => fileInputRef.current?.click()}
          >
            Загрузить карту
          </Button>
        </div>

        {preview && (
          <>
            <div className="grid-settings">
              <Space>
                <span>Сетка:</span>
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
                <Button type="primary" onClick={handleApplyGrid}>
                  Применить
                </Button>
              </Space>
            </div>
            <div className="map-preview">
              <Image
                src={preview}
                alt="Карта"
                style={{ maxHeight: 200, borderRadius: 12 }}
              />
            </div>
          </>
        )}
      </Space>
    </Card>
  )
}
