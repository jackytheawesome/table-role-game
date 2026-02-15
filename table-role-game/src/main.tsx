import { ConfigProvider } from 'antd'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { cartoonTheme } from './theme/cartoon.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider theme={cartoonTheme}>
      <App />
    </ConfigProvider>
  </StrictMode>,
)
