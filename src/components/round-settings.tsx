import { useGameEngine } from '../game-engine';
import { ALL_BLINDS, BREAK_TIMES, ROUND_TIMES } from '../utils';

export function RoundSettings() {
  const engine = useGameEngine()

  const handleClose = (evt) => {
    evt.stopPropagation();
    engine.toggleSettings()
  };

  const setRoundTime = (evt)=>{
    const minutes = parseInt(evt.target.value, 10);
    engine.setRoundDurationSeconds(minutes * 60);
  }

  const setBlinds = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    engine.setStartingChips(parseInt(evt.target.value, 10));
  }

  const setBreakTime = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    const minutes = parseInt(evt.target.value, 10);
    engine.setBreakDurationSeconds(minutes * 60);
  };

  return (
    <div id="lightbox" onClick={handleClose}>
      <div className="settings-panel"
        onClick={(evt) => evt.stopPropagation()}>

        <div className="settings-panel-control">
          <h3>Starting blind</h3>
          <select name="starting-blind" onChange={setBlinds} value={engine.blinds[0].small} >
            {ALL_BLINDS.slice(0, 5).map((blind) => (
              <option key={blind.small} value={blind.small}>
                {blind.small}
              </option>
            ))}
          </select>
        </div>

        <div className="settings-panel-control">
          <h3>Round time</h3>
          <select
            onChange={setRoundTime}
            defaultValue={engine.roundDurationSeconds / 60}
          >
            {ROUND_TIMES.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>


        <div className="settings-panel-control break-settings">
          <h3>Break Duration</h3>
          <select
            onChange={setBreakTime}
            defaultValue={engine.breakDurationSeconds / 60}
          >
            {BREAK_TIMES.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
