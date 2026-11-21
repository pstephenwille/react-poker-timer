import { Header } from './components/header';
import { MainDisplay } from './components/main-display';
import './App.css'
import { BlindsSchedule } from './components/blinds-schedule';
import { useGameEngine } from './game-engine-context';
import { useEffect } from 'react';

export function App() {
  const engine = useGameEngine();


  useEffect(function handleKeyStrokes() {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Escape') {
        if (engine.breakIsActive) {
          engine.toggleBreakIsActive(false)
        }
        if (engine.isSettingsOpen) {
          engine.toggleSettings(false)
        }

      }

      if (event.code === 'Space') {
        if(!engine.hasGameStarted) return;
        event.preventDefault(); // Prevent page scroll
        engine.setGameIsRunning();
      }
    };

    window.addEventListener('keyup', handleKeyPress);

    return () => {
      window.removeEventListener('keyup', handleKeyPress);
    };
  }, [engine.isSettingsOpen, engine.hasGameStarted, engine.breakIsActive, engine]);


  return (
    <div className="app">
      <Header />
      <MainDisplay />
      <BlindsSchedule />
    </div>
  )
}