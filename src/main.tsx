import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.tsx'
import { GameProvider } from './new-game-context';
import { NewApp } from './new-app';

createRoot(document.getElementById('root')!).render(
  <GameProvider>
    <NewApp/>
  </GameProvider>
)
