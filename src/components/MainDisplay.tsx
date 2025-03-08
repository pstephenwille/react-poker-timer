import React from 'react';

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

export const MainDisplay: React.FC<MainDisplayProps> = ({
  breakActive,
  breakRemaining,
  currentRound,
  blinds,
  remainingTime,
  formatTime,
}) => {
  return (
    <div id={'main-display'} className="main-display">
      {breakActive ? (
        <div className="break-display">
          <h2>BREAK TIME</h2>
          <div className="time-remaining">{formatTime(breakRemaining)}</div>
        </div>
      ) : (
        <>
          <div className="blinds-display">
            <div className="small-blind">
              Small Blind
              <h2>{blinds[currentRound].small}</h2>
            </div>

            <div className="time-remaining">
              <p className={'current-level'}>
                Round: {currentRound + 1} of {blinds.length}
              </p>
              {formatTime(remainingTime)}
            </div>

            <div className="big-blind">
              Big Blind
              <h2>{blinds[currentRound].big}</h2>
            </div>
          </div>
        </>
      )}
    </div>
  );
}; 