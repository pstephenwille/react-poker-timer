import { RoundSettings } from './round-settings';
import { ALL_BLINDS, ROUND_TIMES } from '../utils';
import { useEffect, useReducer } from 'react';

export const Header = ({
  initRoundTimeDisplay,
  setRoundTimeInSeconds,
  setInitialGameBlinds,
  handleBreakTimeChange,
  breakTime,
  /* --- */
                         toggleTimer,
                         active,
                         resetTimer,
                         toggleBreak,
                         breakActive,
                         showSettings,
                         setShowSettings,
                         audioEnabled,
                         setAudioEnabled
                       }) => {
  console.log('%c...header.tsx', 'color:gray');
  const [settingsToggle, toggleSettings] = useReducer((toggle) => !toggle, false);

  useEffect(function handleKeyStrokes() {
    console.log('%c...header-key-listner', 'color:gray');

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Escape') {
        if (settingsToggle) {
          toggleSettings();
        }
      }

      if (event.code === 'Space') {
        event.preventDefault(); // Prevent page scroll
        toggleTimer();
      }
    };

    window.addEventListener('keyup', handleKeyPress);

    return () => {
      window.removeEventListener('keyup', handleKeyPress);
    };
  }, [toggleTimer, settingsToggle]);

  return (
    <>
    <div className="header">
      <div className="controls">
        <button onClick={toggleTimer}>{active ? 'Pause' : 'Start'}</button>
        <button onClick={resetTimer}>Reset</button>
        <button onClick={toggleBreak}>
          {breakActive ? 'End Break' : 'Take Break'}
        </button>
        <button id={'toggleSettingsButton'} onClick={() => toggleSettings()}>
          {settingsToggle ? 'Hide Settings' : 'Settings'}
        </button>
        <button onClick={() => setAudioEnabled(!audioEnabled)}>
          {audioEnabled ? 'Mute Sound' : 'Enable Sound'}
        </button>
      </div>
    </div>

      {settingsToggle &&
          <RoundSettings
              isOpen={settingsToggle}
              onClose={toggleSettings}
              initRoundTimeDisplay={initRoundTimeDisplay}
              setRoundTimeInSeconds={setRoundTimeInSeconds}
              setInitialGameBlinds={setInitialGameBlinds}
              breakTime={breakTime}
              handleBreakTimeChange={handleBreakTimeChange}
          />
      }
    </>

  )
}
