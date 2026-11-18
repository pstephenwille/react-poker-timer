import { useGame } from '../new-game-context';
import { ALL_BLINDS, ROUND_TIMES } from '../utils';

export function RoundSettings() {
  const game = useGame()

  const handleClose = (evt) => {
    evt.stopPropagation();
    game.toggleSettings()
  };

  const initializeBlindsForNewGame = (selectedBlind: number) => {
    const gameBlinds = ALL_BLINDS.filter(blind => blind.small >= selectedBlind);
    return gameBlinds;
  }

  const setInitialGameBlinds = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    const gameBlinds = initializeBlindsForNewGame(parseInt(evt.target.value, 10));
    game.setBlinds(gameBlinds);
  }

  const handleBreakTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const minutes = parseInt(e.target.value, 10) * 60;
    game.setBreakDurationSeconds(minutes);
    // setBreakRemaining(time);
  };

  return (
    <div id="lightbox" onClick={handleClose}>
      <button onClick={handleClose}>
        <h4 id="close-settings">X</h4>
      </button>

      <div className="settings-panel"
        onClick={(evt) => evt.stopPropagation()}>
        <div className="settings-panel-control">
          <h3>Round time</h3>
          <select
            onChange={(evt) => {
              const minutes = parseInt(evt.target.value, 10);
              game.setRoundDurationSeconds(minutes * 60);
            }}
            defaultValue={10}
          >
            {ROUND_TIMES.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        <div className="settings-panel-control">
          <h3>Starting blind</h3>
          <select name="starting-blind" onChange={setInitialGameBlinds}>
            {ALL_BLINDS.slice(0, 5).map((blind) => (
              <option key={blind.small} value={blind.small}>
                {blind.small}
              </option>
            ))}
          </select>
        </div>

        <div className="settings-panel-control break-settings">
          <h3>Break Duration</h3>
          <input
            type="number"
            value={10}
            onChange={handleBreakTimeChange}
            min="1"
            max="60"
          />
        </div>
      </div>
    </div>
  );
}
