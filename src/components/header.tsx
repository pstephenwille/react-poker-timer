import { RoundSettings } from './round-settings';
import { useEffect, useReducer } from 'react';
import { BreakTimer } from './break-timer';

export const Header = ({
  initRoundTimeDisplay,
  setRoundTimeInSeconds,
  setInitialGameBlinds,
  handleBreakTimeChange,
  breakTime,
  /* --- */
                         setRoundIsActive,
                         active,
                         resetTimer,
                         toggleBreak,
                         breakActive: breakIsActive,
                         audioEnabled,
                         setAudioEnabled
                       }) => {
  const [settingsToggle, toggleSettings] = useReducer((toggle) => !toggle, false);

  useEffect(function handleKeyStrokes() {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Escape') {
        if (settingsToggle) {
          toggleSettings();
        }
      }

      if (event.code === 'Space') {
        event.preventDefault(); // Prevent page scroll
        setRoundIsActive();
      }
    };

    window.addEventListener('keyup', handleKeyPress);

    return () => {
      window.removeEventListener('keyup', handleKeyPress);
    };
  }, [setRoundIsActive, settingsToggle]);
  
  return (
    <>
    <div className="header">
      <div className="controls">
        <button onClick={setRoundIsActive}>{active ? 'Pause' : 'Start'}</button>
        <button onClick={resetTimer}>Reset</button>
        <button onClick={toggleBreak}>
          {breakIsActive ? 'End Break' : 'Take Break'}
        </button>
        <button id={'toggleSettingsButton'} onClick={() => toggleSettings()}>
          {settingsToggle ? 'Hide Settings' : 'Settings'}
        </button>
        <button onClick={() => setAudioEnabled(!audioEnabled)}>
          {audioEnabled ? 'Mute Sound' : 'Enable Sound'}
        </button>
      </div>
    </div>

      {breakIsActive &&(
        <BreakTimer breakIsActive={breakIsActive} breakTime={breakTime} toggleBreak={toggleBreak} />
      )}
      
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
