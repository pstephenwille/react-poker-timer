import { createRoot } from 'react-dom/client'
import './index.css'
import { GameProvider } from './game-engine-context';
import { App } from './app';

createRoot(document.getElementById('root')!).render(
  <GameProvider>
    <App/>
  </GameProvider>
)
