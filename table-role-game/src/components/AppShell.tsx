import { Layout } from 'antd'
import { Sidebar } from './Sidebar'

interface AppShellProps {
  children: React.ReactNode
}

/**
 * Figma: Узкая левая панель + основная область
 */
export function AppShell({ children }: AppShellProps) {
  return (
    <Layout className="app-shell">
      <Sidebar />
      <Layout.Content className="app-main">{children}</Layout.Content>
    </Layout>
  )
}
