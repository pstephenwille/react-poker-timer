import { createContext, useContext, useReducer, useRef, useState } from 'react';
import { ALL_BLINDS, initializeBlindsForNewGame } from './utils';

export type GameStatus = 'paused' | 'running' | 'break';

const booleanToggleReducer = (current: boolean, override?: unknown): boolean =>
  typeof override === 'boolean' ? override : !current;

function usePokerGame() {
  const [status, setStatus] = useReducer(
    (current: GameStatus, next?: unknown) =>
      typeof next === 'string'
        ? next
        : current === 'running' ? 'paused' : 'running',
    'paused'
  );
  const [isSettingsOpen, toggleSettings] = useReducer(booleanToggleReducer, false);
  const [breakIsActive, toggleBreakIsActive] = useReducer(booleanToggleReducer, false);
  const [isAudioEnabled, toggleAudio] = useReducer(booleanToggleReducer, true);
  const [resetCount, triggerReset] = useReducer((count: number) => count + 1, 0);
  const [currentRound, setCurrentRound] = useState(0);
  const [blinds, setBlinds] = useState(ALL_BLINDS);
  const [roundDurationSeconds, setRoundDurationSeconds] = useState(600);
  const [breakDurationSeconds, setBreakDurationSeconds] = useState(600);

  const audioRef = useRef<HTMLAudioElement>(null);

  // Multi-state reset helper
  const resetGame = () => {
    // reset to defaults
    setStatus('paused');
    setCurrentRound(0);
    triggerReset();
  };

  return {
    // State & derived flags
    status,
    isRunning: status === 'running',
    isOnBreak: status === 'break',
    isSettingsOpen,
    isAudioEnabled,
    resetCount,
    currentRound,
    blinds,
    roundDurationSeconds,
    breakDurationSeconds,
    audioRef,
    breakIsActive,

    // Stable dispatchers & setters
    setBlinds,
    toggleBreakIsActive,
    setStatus,
    toggleSettings,
    toggleAudio,
    setCurrentRound,
    setRoundDurationSeconds,
    setBreakDurationSeconds,
    setStartingChips: (chips: number) => setBlinds(initializeBlindsForNewGame(chips)),
    resetGame,
  };
}

const NewGameContext = createContext<ReturnType<typeof usePokerGame> | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const game = usePokerGame();

  return (
    <NewGameContext.Provider value={game}>
      <audio ref={game.audioRef} src="/assets/jackpot-winner.mp3" preload="auto" />
      {children}
    </NewGameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(NewGameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
