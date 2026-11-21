import { createContext, useContext, useReducer, useRef, useState } from 'react';
import { ALL_BLINDS, DEFAULT_BREAK_SECONDS, DEFAULT_ROUND_SECONDS, initializeBlindsForNewGame } from './utils';



const booleanToggleReducer = (current: boolean, override?: unknown): boolean => typeof override === 'boolean' ? override
  : !current;

function usePokerGameEngine() {
  const [hasGameStarted, setGameHasStarted] = useState(false)
  const [gameIsRunning, setGameIsRunning] = useReducer(booleanToggleReducer, false);
  const [resetGameToggled, toggleGameReset] = useReducer(booleanToggleReducer, false);
  const [isSettingsOpen, toggleSettings] = useReducer(booleanToggleReducer, false);
  const [breakIsActive, toggleBreakIsActive] = useReducer(booleanToggleReducer, false);
  const [isAudioEnabled, toggleAudio] = useReducer(booleanToggleReducer, true);
  const [currentRound, incrementCurrentRound] = useReducer((roundCount: number, override?: number) => (
    Number.isInteger(override)
  ) ? override
    : roundCount + 1, 0);
  const [blinds, setBlinds] = useState(ALL_BLINDS);
  const [roundDurationSeconds, setRoundDurationSeconds] = useState(DEFAULT_ROUND_SECONDS);
  const [breakDurationSeconds, setBreakDurationSeconds] = useState(DEFAULT_BREAK_SECONDS);

  const roundEndAudioRef = useRef<HTMLAudioElement>(null);
  const breakEndAudioRef = useRef<HTMLAudioElement>(null);

  const resetGame = () => {
    toggleGameReset()
    setGameIsRunning(false);
    incrementCurrentRound(0);
    setRoundDurationSeconds(DEFAULT_ROUND_SECONDS)
    setBreakDurationSeconds(DEFAULT_BREAK_SECONDS)
    setGameHasStarted(false)
  };

  const startPokerGame = () => {
    if (hasGameStarted) {
      setGameIsRunning()
    }else{
      setGameHasStarted(true);
      setGameIsRunning(true)
    }

  }

  return {
    // State & derived flags
    gameIsRunning,
    isSettingsOpen,
    isAudioEnabled,
    currentRound,
    blinds,
    roundDurationSeconds,
    breakDurationSeconds,
    breakIsActive,
    resetGameToggled,
    hasGameStarted,
    roundEndAudioRef,
    breakEndAudioRef,

    // Stable dispatchers & setters
    startPokerGame,
    toggleGameReset,
    setBlinds,
    toggleBreakIsActive,
    setGameIsRunning,
    toggleSettings,
    toggleAudio,
    incrementCurrentRound,
    setRoundDurationSeconds,
    setBreakDurationSeconds,
    setStartingChips: (chips: number) => setBlinds(initializeBlindsForNewGame(chips)),
    resetGame,
  };
}

const GameEngineContext = createContext<ReturnType<typeof usePokerGameEngine> | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const game = usePokerGameEngine();

  return (
    <GameEngineContext.Provider value={game}>
      <audio ref={game.roundEndAudioRef} src="/assets/jackpot-winner.mp3" preload="auto" />
      <audio ref={game.breakEndAudioRef} src="/assets/air-horn.mp3" preload="auto" />
      {children}
    </GameEngineContext.Provider>
  );
}

export function useGameEngine() {
  const context = useContext(GameEngineContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
