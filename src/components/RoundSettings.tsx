import React from 'react';
import { ALL_BLINDS, DEFAULT_STARING_ROUND_TIME_SECONDS, ROUND_TIMES } from '../utils';

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
                                                              showSettings,
                                                              breakTime,
                                                              handleBreakTimeChange,
                                                              setRoundTimeInSeconds,
                                                              roundTimeInSeconds,
                                                              setInitialGameBlinds,
                                                              currentRound,
                                                              blinds,
                                                            }) => {
  return (
    <div id={'round-settings'}>
      {showSettings && (
        <div className="settings-panel">
          <h3>Settings</h3>

          <div id={'SettingsPanelControls'}>
            <div className={'settings-panel-control'}>
              <h3>Round time</h3>
              <select
                onChange={(evt) => {
                  const minutes = parseInt(evt.target.value, 10);
                  setRoundTimeInSeconds(minutes * 60);
                }}
                defaultValue={DEFAULT_STARING_ROUND_TIME_SECONDS / 60}
              >
                {ROUND_TIMES.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>

            <div className={'settings-panel-control'}>
              <h3>Starting blind</h3>
              <select name={'starting-blind'} onChange={setInitialGameBlinds}>
                {ALL_BLINDS.slice(0, 5).map(blind => (
                  <option key={blind.small} value={blind.small}>{blind.small}</option>
                ))}
              </select>
            </div>

            <div className="settings-panel-control break-settings">
              <h3>Break Duration</h3>
              <input
                type="number"
                value={breakTime / 60}
                onChange={handleBreakTimeChange}
                min="1"
                max="60"
              />
            </div>
          </div>
        </div>
      )}

      <div className="next-levels">
        <h3>Upcoming Blinds</h3>
        <div className="levels-list">
          {blinds.slice(currentRound + 1, currentRound + 4).map((level, index) => (
            <div key={index} className="level-item">
              <div>Level {currentRound + index + 2}</div>
              <div>SB: {level.small} / BB: {level.big}</div>
              <div>{roundTimeInSeconds / 60} min</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 
