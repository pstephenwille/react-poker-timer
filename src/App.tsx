import { useEffect, useRef, useState } from 'react'
import './App.css'
import { ALL_BLINDS, formatTime, intializeBlindsForNewGame, playAudio } from "./utils.ts";
import { Header } from "./header.tsx";
import { MainDisplay } from './components/MainDisplay';
import { RoundSettings } from './components/RoundSettings';

function App() {
  const [remainingTime, setRemainingTime] = useState(30);
  const [active, setActive] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [blinds, setBlinds] = useState(ALL_BLINDS);
  const [showSettings, setShowSettings] = useState(false);
  const [breakActive, setBreakActive] = useState(false);
  const [breakTime, setBreakTime] = useState(300); // 5 minutes default
  const [breakRemaining, setBreakRemaining] = useState(300);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [roundTimeInSeconds, setRoundTimeInSeconds] = useState(30);

  const ONE_SECOND = 1000;
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(function updateTimeOnRoundTimeChanges() {
    setRemainingTime(roundTimeInSeconds);
  }, [roundTimeInSeconds]);

  const resetForNextRound = (prevRound) => {
    setTimeout(() => {
      setCurrentRound(prevRound => prevRound + 1);
      setRemainingTime(roundTimeInSeconds);
    }, ONE_SECOND);
  }

  const hasRoundEnded = (prevTime) => (prevTime <= 1);

  useEffect(function runGameTimer() {
    let timerId: number | undefined;

    if (active && remainingTime > 0) {
      timerId = window.setInterval(() => {
        const roundTime = Math.max(0, (remainingTime - 1));
        const isRoundOver = hasRoundEnded(remainingTime)
        if (isRoundOver) {
          playAudio(audioRef);
          resetForNextRound(remainingTime)
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
        playAudio(audioRef);
      }
      setBreakActive(false);
      setBreakRemaining(breakTime);
    }

    return () => {
      if (timerId) window.clearInterval(timerId);
    };
  }, [active, breakActive, breakRemaining, breakTime, audioEnabled, roundTimeInSeconds, blinds.length, remainingTime]);

  const toggleTimer = () => setActive(!active);

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
    const gameBlinds = intializeBlindsForNewGame(parseInt(evt.target.value, 10));
    setBlinds(gameBlinds);
  }

  useEffect(function spaceBarPausesToggle() {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space' && !showSettings) {
        event.preventDefault(); // Prevent page scroll
        toggleTimer();
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [showSettings, toggleTimer]);


  return (
    <div className="app">
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
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        audioEnabled={audioEnabled}
        setAudioEnabled={setAudioEnabled}
      />

      <MainDisplay
        breakActive={breakActive}
        breakRemaining={breakRemaining}
        currentRound={currentRound}
        blinds={blinds}
        remainingTime={remainingTime}
        formatTime={formatTime}
      />

      <RoundSettings
        showSettings={showSettings}
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
