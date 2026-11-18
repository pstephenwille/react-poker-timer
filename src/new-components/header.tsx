import { BreakTimer } from '../components/break-timer';
import { RoundSettings } from '../components/round-settings';
import { useGame } from '../new-game-context';

export function Header() {
  const game = useGame();

  return (
    <>
      <div className="header">
        <div className="controls">
          <button onClick={game.setStatus}>{game.status === 'pause'? 'Paused': 'Start'}</button>
          <button onClick={game.resetGame}>Reset</button>
          <button onClick={game.toggleBreakIsActive}>
            {game.breakIsActive ? 'End Break' : 'Take Break'}
          </button>
          <button id={'toggleSettingsButton'} onClick={game.toggleSettings}>
            {game.isSettingsOpen ? 'Hide Settings' : 'Settings'}
          </button>
          <button onClick={game.toggleAudio}>
            {game.isAudioEnabled ? 'Mute Sound' : 'Enable Sound'}
          </button>
        </div>
      </div>

      {game.breakIsActive &&(
        <BreakTimer breakDurationSeconds={game.breakDurationSeconds}  />
      )}

      {game.isSettingsOpen &&
          <RoundSettings />
      }

      <audio
        ref={game.audioRef}
        src="/assets/jackpot-winner.mp3"
        preload="auto"
      />
    </>

  )
}