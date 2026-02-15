import { useState } from 'react'
import {
  Button,
  Card,
  Checkbox,
  Input,
  Modal,
  Progress,
  Radio,
  Select,
  Slider,
  Space,
  Steps,
  Switch,
  Tag,
} from 'antd'
import './App.css'

function App() {
  const [modalOpen, setModalOpen] = useState(false)
  const [sliderValue, setSliderValue] = useState(26)

  return (
    <div className="app-cartoon">
      <h1>Cartoon Theme Demo</h1>
      <p className="subtitle">Ant Design в мультяшном стиле</p>

      <Card className="demo-card" title="Кнопки">
        <Space wrap>
          <Button type="primary">Primary</Button>
          <Button danger>Danger</Button>
          <Button>Default</Button>
          <Button type="dashed">Dashed</Button>
          <Button type="primary" onClick={() => setModalOpen(true)}>
            Открыть Modal
          </Button>
        </Space>
      </Card>

      <Card className="demo-card" title="Input и Select">
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Input placeholder="Info Text" />
          <Select placeholder="Dropdown" style={{ width: '100%' }} />
        </Space>
      </Card>

      <Card className="demo-card" title="Теги">
        <Space wrap>
          <Tag closable>Apple</Tag>
          <Tag closable>Orange</Tag>
        </Space>
      </Card>

      <Card className="demo-card" title="Progress">
        <Progress percent={60} />
      </Card>

      <Card className="demo-card" title="Steps">
        <Steps
          current={1}
          items={[
            { title: 'Finished', status: 'finish' },
            { title: 'In Progress', status: 'process' },
            { title: 'Waiting', status: 'wait' },
          ]}
        />
      </Card>

      <Card className="demo-card" title="Slider">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Slider
            min={0}
            max={100}
            value={sliderValue}
            onChange={setSliderValue}
            marks={{ 0: '0°C', 26: '26°C', 37: '37°C', 100: '100°C' }}
          />
        </Space>
      </Card>

      <Card className="demo-card" title="Switch и Checkbox">
        <Space direction="vertical" size="large">
          <Space>
            <Switch defaultChecked />
            <span>Switch</span>
          </Space>
          <Space direction="vertical">
            <Checkbox>Apple</Checkbox>
            <Checkbox checked>Orange</Checkbox>
            <Checkbox>Banana</Checkbox>
          </Space>
          <Radio.Group defaultValue="banana">
            <Space direction="vertical">
              <Radio value="apple">Apple</Radio>
              <Radio value="banana">Banana</Radio>
            </Space>
          </Radio.Group>
        </Space>
      </Card>

      <Modal
        title="Ant Design"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => setModalOpen(false)}
      >
        <p>Modal в мультяшном стиле с мягкими углами и пастельными цветами.</p>
      </Modal>
    </div>
  )
}

export default App
