import { GameProvider, useGame } from './context/GameContext'
import { AppShell } from './components/AppShell'
import { SetupMode } from './views/SetupMode'
import { GameMode } from './views/GameMode'
import './App.css'

function AppContent() {
  const { mode } = useGame()
  return (
    <AppShell>
      {mode === 'setup' ? <SetupMode /> : <GameMode />}
    </AppShell>
  )
}

export default function App() {
  return (
    <GameProvider>
      <div className="master-app">
        <AppContent />
      </div>
    </GameProvider>
  )
}
