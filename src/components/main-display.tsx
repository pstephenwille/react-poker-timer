import React from 'react';
import { RoundTimer } from './round-timer';

interface MainDisplayProps {
  currentRound: number;
  blinds: Array<{
    small: number;
    big: number;
  }>;
  remainingTime: number;
  formatTime: (seconds: number) => string;
}

export const MainDisplay: React.FC<any> = ({
  currentRound,
  blinds,
  handleRoundEnd,
  active,
  roundTimeInSeconds,
  audioRef,
  audioEnabled,
  resetGameToggle,
  toggleBreak
}) => {

  return (
    <div id={'main-display'} className="main-display">
        <RoundTimer />
    </div>
  );
}; 
