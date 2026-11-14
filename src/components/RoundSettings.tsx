import React from 'react';

interface RoundSettingsProps {
  showSettings: boolean;
  breakTime: number;
  handleBreakTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setRoundTimeInSeconds: (seconds: number) => void;
  roundTimeInSeconds: number;
  setInitialGameBlinds: (evt: React.ChangeEvent<HTMLSelectElement>) => void;
  currentRound: number;
  blinds: Array<{
    small: number;
    big: number;
  }>;
}

export const RoundSettings: React.FC<RoundSettingsProps> = ({
  roundTimeInSeconds,
  currentRound,
  blinds,
}) => {
  return (

    <div id={'round-settings'}>


      <div className="next-levels">
        <h3>Upcoming Blinds</h3>
        <div className="levels-list">
          {blinds.slice(currentRound + 1, currentRound + 4).map((level, index) => (
            <div key={index} className="level-item">
              <div>Level {currentRound + index + 2}</div>
              <p>SB: {level.small} / BB: {level.big}</p>
              <p>{roundTimeInSeconds / 60} min</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 
