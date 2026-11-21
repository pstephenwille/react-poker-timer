import { Header } from './components/header';
import { MainDisplay } from './components/main-display';
import './App.css'
import { BlindsSchedule } from './components/blinds-schedule';
import { useGameEngine } from './game-engine-context';
import { useEffect, useEffectEvent } from 'react';

const isTypingInFormField = (target: EventTarget | null) =>
  target instanceof HTMLInputElement
  || target instanceof HTMLSelectElement
  || target instanceof HTMLTextAreaElement;

const preventSpaceFromScrollingPageOnKeyDown = (event: KeyboardEvent) => event.preventDefault();

const stopFocusedButtonFromAlsoClickingOnKeyUp = (target: EventTarget | null) => {
  if (target instanceof HTMLButtonElement) target.blur();
};

export function App() {
  const engine = useGameEngine();

  const closeOpenOverlays = () => {
    if (engine.breakIsActive) {
      engine.endBreak()
    }
    if (engine.isSettingsOpen) {
      engine.toggleSettings(false)
    }
  };

  const toggleGameClockWithSpaceBar = (event: KeyboardEvent) => {
    if (isTypingInFormField(event.target)) return;

    preventSpaceFromScrollingPageOnKeyDown(event);
    stopFocusedButtonFromAlsoClickingOnKeyUp(event.target);

    const isOverlayCoveringGameClock = engine.breakIsActive || engine.isSettingsOpen;
    const isKeyHeldDown = event.repeat;
    const canToggleGameClock = engine.hasGameStarted && !isOverlayCoveringGameClock && !isKeyHeldDown;

    if (canToggleGameClock) engine.setGameIsRunning();
  };

  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (event.code === 'Escape') closeOpenOverlays();
    if (event.code === 'Space') toggleGameClockWithSpaceBar(event);
  });

  useEffect(function listenForKeyboardShortcuts() {
    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);


  return (
    <div className="app">
      <Header />
      <MainDisplay />
      <BlindsSchedule />
    </div>
  )
}
