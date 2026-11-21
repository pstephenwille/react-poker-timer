import React from 'react';
import { RoundTimer } from './round-timer';
import { useGameEngine } from '../game-engine';

export const MainDisplay: React.FC<any> = () => {
  const engine = useGameEngine()

  return (
    <div key={`${engine.resetGameToggled}-${engine.roundDurationSeconds}`} id={'main-display'} className="main-display">
      <RoundTimer />
    </div>
  );
}; 
