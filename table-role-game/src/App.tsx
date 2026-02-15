import { GameProvider, useGame } from './context/GameContext'
import { SetupView } from './views/SetupView'
import { GameView } from './views/GameView'
import './App.css'

function AppContent() {
  const { mode } = useGame()
  return mode === 'setup' ? <SetupView /> : <GameView />
}

function App() {
  return (
    <GameProvider>
      <div className="master-app">
        <AppContent />
      </div>
    </GameProvider>
  )
}

export default App
