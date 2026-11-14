import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import './App.css'
import { ALL_BLINDS, formatTimeMMSS, initializeBlindsForNewGame, playAudio, ROUND_TIMES } from "./utils.ts";
import { Header } from "./components/Header.tsx";
import { MainDisplay } from './components/MainDisplay';
import { RoundSettings } from './components/RoundSettings';
import { confetti } from "@tsparticles/confetti";
console.log('%c...confetti', 'color:gold',   confetti);
const brandColors = ['#FFC5FF', "#FFFF6B", "#00e5ff", '#ffffff', '#ccff00'];
function startConfettiCelebration(durationInSeconds = 3) {
  const endTime = Date.now() + durationInSeconds * 1000;

  function frame() {
    // Launch a small burst from the left edge
    confetti({
      particleCount: 5,
      angle: 60,
      startVelocity: 75,
      spread: 100,
      origin: { x: 0, y: 0.9 },
      colors: brandColors
    });

    // Launch a small burst from the right edge
    confetti({
      particleCount: 5,
      startVelocity: 75,
      angle: 120,
      spread: 100,
      origin: { x: 1, y: 0.9 },
      colors: brandColors
    });

    // Keep looping until the timer expires
    if (Date.now() < endTime) {
      requestAnimationFrame(frame);
    }
  }

  requestAnimationFrame(frame);
}


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
  const [roundTimeInSeconds, setRoundTimeInSeconds] = useState(600 );
  const ONE_SECOND = 1_000;
  const initRoundTimeDisplay = roundTimeInSeconds / 60;
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


  useEffect(function handleKeyStrokes() {
    const handleKeyPress = (event: KeyboardEvent) => {
      if(event.code === 'Escape'){
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

  useEffect(function updateTimeOnRoundTimeChanges() {
    setRemainingTime(roundTimeInSeconds);
  }, [roundTimeInSeconds]);

  useEffect(function triggerColorUpBreak() {
    console.log('%c...blinds', 'color:gold',   blinds, currentRound);
    
    if (blinds[currentRound].small === 25) {
      console.log('%c...blinds color-up', 'color:gold');
      // setBreakActive(breakActive)
      toggleBreak()
    }
  }, [blinds, currentRound]);

  useEffect(function runGameTimer() {
    let timerId: number | undefined;

    if (active && remainingTime > 0) {
      timerId = window.setInterval(() => {
        const roundTime = Math.max(0, (
          remainingTime - 1
        ));
        const isRoundOver = hasRoundEnded(remainingTime)
        if (isRoundOver) {
          startConfettiCelebration()
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
                defaultValue={initRoundTimeDisplay}
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
