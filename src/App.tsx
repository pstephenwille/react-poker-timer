import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import './App.css'
import { ALL_BLINDS, formatTimeMMSS, initializeBlindsForNewGame, playAudio, ROUND_TIMES } from "./utils.ts";
import { Header } from "./components/Header.tsx";
import { MainDisplay } from './components/MainDisplay';
import { RoundSettings } from './components/RoundSettings';

function App() {
  const [remainingTime, setRemainingTime] = useState(30);
  const [active, setActive] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [blinds, setBlinds] = useState(ALL_BLINDS);
  const [settingsToggle, toggleSettings] = useReducer((toggle)=>!toggle, false);
  const [breakActive, setBreakActive] = useState(false);
  const [breakTime, setBreakTime] = useState(600); // 5 minutes default
  const [breakRemaining, setBreakRemaining] = useState(600);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [roundTimeInSeconds, setRoundTimeInSeconds] = useState(30);
  const ONE_SECOND = 1_000;
  const audioRef = useRef<HTMLAudioElement>(null);

  const resetForNextRound = useCallback(() => {
    setTimeout(() => {
      setCurrentRound(prevRound => prevRound + 1);
      setRemainingTime(roundTimeInSeconds);
    }, ONE_SECOND);
  }, [roundTimeInSeconds])
  const hasRoundEnded = useCallback((prevTime: number) => (
    prevTime <= 1
  ), []);
  const toggleTimer = useCallback(() => setActive(!active), [active]);

  const resetTimer = () => {
    setActive(false);
    setCurrentRound(0);
    setRemainingTime(roundTimeInSeconds);
    setBreakActive(false);
    setBreakRemaining(breakTime);
  };

  const toggleBreak = () => {
    if (breakActive) {
      setBreakActive(false);
      setBreakRemaining(breakTime);
    } else {
      setActive(false);
      setBreakActive(true);
    }
  };
  const handleBreakTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseInt(e.target.value, 10) * 60;
    setBreakTime(time);
    setBreakRemaining(time);
  };
  const setInitialGameBlinds = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    const gameBlinds = initializeBlindsForNewGame(parseInt(evt.target.value, 10));
    setBlinds(gameBlinds);
  }

  useEffect(function spaceBarPausesToggle() {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault(); // Prevent page scroll
        toggleTimer();
      }
    };

    window.addEventListener('keyup', handleKeyPress);

    return () => {
      window.removeEventListener('keyup', handleKeyPress);
    };
  }, [toggleTimer]);

  useEffect(function updateTimeOnRoundTimeChanges() {
    setRemainingTime(roundTimeInSeconds);
  }, [roundTimeInSeconds]);

  useEffect(function triggerColorUpBreak() {
    if (currentRound === 4) {
      console.log('%c...blinds color-up', 'color:gold');
      // setBreakActive(breakActive)
      toggleBreak()
    }
  }, [currentRound]);

  useEffect(function runGameTimer() {
    let timerId: number | undefined;

    if (active && remainingTime > 0) {
      timerId = window.setInterval(() => {
        const roundTime = Math.max(0, (
          remainingTime - 1
        ));
        const isRoundOver = hasRoundEnded(remainingTime)
        if (isRoundOver) {
          playAudio(audioRef, audioEnabled);
          resetForNextRound()
        }
        setRemainingTime(roundTime)
      }, ONE_SECOND);
    } else if (breakActive && breakRemaining > 0) {
      timerId = window.setInterval(() => {
        setBreakRemaining(prevTime => prevTime - 1);
      }, ONE_SECOND);
    } else if (breakActive && breakRemaining === 0) {
      // End break
      if (audioRef.current) {
        playAudio(audioRef, audioEnabled);
      }
      setBreakActive(false);
      setBreakRemaining(breakTime);
      setActive(true)
    }

    return () => {
      if (timerId) window.clearInterval(timerId);
    };
  }, [
    active,
    breakActive,
    breakRemaining,
    breakTime,
    audioEnabled,
    roundTimeInSeconds,
    remainingTime,
    hasRoundEnded,
    resetForNextRound
  ]);


  return (
    <div className="app">
      {settingsToggle && (
        <div id={'lightbox'}>
        <button onClick={toggleSettings}><h4>X</h4></button>
          <div className="settings-panel">
            <div className={'settings-panel-control'}>
              <h3>Round time</h3>
              <select
                onChange={(evt) => {
                  const minutes = parseInt(evt.target.value, 10);
                  setRoundTimeInSeconds(minutes * 60);
                }}
                defaultValue={5}
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
      <audio
        ref={audioRef}
        src="/assets/jackpot-winner.mp3"
        preload="auto"
      />

      <Header
        toggleTimer={toggleTimer}
        active={active}
        resetTimer={resetTimer}
        toggleBreak={toggleBreak}
        breakActive={breakActive}
        showSettings={settingsToggle}
        setShowSettings={toggleSettings}
        audioEnabled={audioEnabled}
        setAudioEnabled={setAudioEnabled}
      />

      <MainDisplay
        breakActive={breakActive}
        breakRemaining={breakRemaining}
        currentRound={currentRound}
        blinds={blinds}
        remainingTime={remainingTime}
        formatTime={formatTimeMMSS}
      />

      <RoundSettings
        showSettings={settingsToggle}
        breakTime={breakTime}
        handleBreakTimeChange={handleBreakTimeChange}
        setRoundTimeInSeconds={setRoundTimeInSeconds}
        roundTimeInSeconds={roundTimeInSeconds}
        setInitialGameBlinds={setInitialGameBlinds}
        currentRound={currentRound}
        blinds={blinds}
      />
    </div>
  );
}

export default App;
