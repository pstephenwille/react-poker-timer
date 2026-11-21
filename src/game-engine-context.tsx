import { useRef } from 'react';
import { GameEngineContext, usePokerGameEngine } from './game-engine';

export function GameProvider({ children }: { children: React.ReactNode }) {
  const roundEndAudioRef = useRef<HTMLAudioElement>(null);
  const breakEndAudioRef = useRef<HTMLAudioElement>(null);
  const game = usePokerGameEngine({ roundEndAudioRef, breakEndAudioRef });

  return (
    <GameEngineContext.Provider value={game}>
      <audio ref={roundEndAudioRef} src="/assets/jackpot-winner.mp3" preload="auto" />
      <audio ref={breakEndAudioRef} src="/assets/air-horn.mp3" preload="auto" />
      {children}
    </GameEngineContext.Provider>
  );
}
