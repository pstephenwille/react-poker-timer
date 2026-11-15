import React from 'react';
import { BreakTimer } from './break-timer';
import { RoundTimer } from './round-timer';

interface MainDisplayProps {
  breakActive: boolean;
  breakRemaining: number;
  currentRound: number;
  blinds: Array<{
    small: number;
    big: number;
  }>;
  remainingTime: number;
  formatTime: (seconds: number) => string;
}

export const MainDisplay: React.FC<any> = ({
  breakActive,
  breakTime,
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
  console.log('%c...main-display', 'color:black',   blinds);

  const currentBlind = blinds[currentRound] || blinds.at(-1);

  return (
    <div id={'main-display'} className="main-display">
      {breakActive &&(
        <div id="lightbox" onClick={(evt)=>{
            evt.stopPropagation()
          toggleBreak(false)
        }}>
        <BreakTimer breakTime={breakTime} toggleBreak={toggleBreak} />
        </div>
      )}
        <RoundTimer currentBlind={currentBlind}
                    toggleBreak={toggleBreak}
                    audioRef={audioRef}
                    resetGameToggle={resetGameToggle}
                    audioEnabled={audioEnabled}
                    roundTimeInSeconds={roundTimeInSeconds}
                    active={active}
                    handleRoundEnd={handleRoundEnd}
                    currentRound={currentRound} />

    </div>
  );
}; 
