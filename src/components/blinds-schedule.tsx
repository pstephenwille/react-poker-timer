import React from 'react';
import { useGameEngine } from '../game-engine';

export const BlindsSchedule: React.FC<any> = () => {
  const engine = useGameEngine()

  const isLastBlind = engine.currentRound + 1 >= engine.blinds.length;
  const remainingBlinds = isLastBlind
    ? [engine.blinds.at(-1)]
    : engine.blinds.slice(engine.currentRound + 1, engine.currentRound + 4)

  return (
    <div id={'blinds-schedule'}>
      <div className="next-levels">
        <h3>{isLastBlind?"Final Blinds " : "Upcoming Blinds"}</h3>
        <div className="levels-list">
          {remainingBlinds.map((level, index) => {
            return (
              <div key={index} className="level-item">
                <div>Level {engine.currentRound + index + 2}</div>
                <p>{level.small} / {level.big}</p>
                <p>{engine.roundDurationSeconds / 60} min Round</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}; 
