export const Header = ({
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

  return (
    <div className="header">
      <div className="controls">
        <button onClick={toggleTimer}>{active ? 'Pause' : 'Start'}</button>
        <button onClick={resetTimer}>Reset</button>
        <button onClick={toggleBreak}>
          {breakActive ? 'End Break' : 'Take Break'}
        </button>
        <button id={'toggleSettingsButton'} onClick={() => setShowSettings(!showSettings)}>
          {showSettings ? 'Hide Settings' : 'Settings'}
        </button>
        <button onClick={() => setAudioEnabled(!audioEnabled)}>
          {audioEnabled ? 'Mute Sound' : 'Enable Sound'}
        </button>
      </div>
    </div>
  )
}
