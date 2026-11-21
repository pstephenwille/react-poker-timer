import { BreakTimer } from './break-timer';
import { RoundSettings } from './round-settings';
import { useGameEngine } from '../game-engine';

export function Header() {
  const engine = useGameEngine();

  return (
    <>
      <div className="header">
        <div className="controls">
          <button onClick={engine.startPokerGame}>{engine.gameIsRunning? 'Pause': 'Start'}</button>
          <button onClick={engine.resetGame}>Reset</button>
          <button onClick={engine.toggleBreakIsActive}>
            {engine.breakIsActive? 'End Break' : 'Take Break'}
          </button>
          <button id={'toggleSettingsButton'} onClick={engine.toggleSettings}>
            {engine.isSettingsOpen ? 'Hide Settings' : 'Settings'}
          </button>
          <button onClick={engine.toggleAudio}>
            {engine.isAudioEnabled ? 'Mute Sound' : 'Enable Sound'}
          </button>
        </div>
      </div>

      {engine.breakIsActive &&(
        <BreakTimer breakDurationSeconds={engine.breakDurationSeconds}  />
      )}

      {engine.isSettingsOpen &&
          <RoundSettings />
      }
    </>

  )
}