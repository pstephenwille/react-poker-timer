import { useEffect, useRef, useState } from 'react'
import './App.css'
import { ALL_BLINDS, formatTime, intializeBlindsForNewGame, playAudioBak } from "./utils.ts";
import { Header } from "./header.tsx";
import { MainDisplay } from './components/MainDisplay';
import { RoundSettings } from './components/RoundSettings';

// Define types
type Blind = {
  small: number;
  big: number;
};

function App() {
  // State for timer
  const [remainingTime, setRemainingTime] = useState(30);
  const [active, setActive] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [blinds, setBlinds] = useState(ALL_BLINDS);
  const [showSettings, setShowSettings] = useState(false);
  const [editingRound, setEditingRound] = useState<number | null>(null);
  const [newRound, setNewRound] = useState({ small: 0, big: 0 });
  const [breakActive, setBreakActive] = useState(false);
  const [breakTime, setBreakTime] = useState(300); // 5 minutes default
  const [breakRemaining, setBreakRemaining] = useState(300);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [roundTimeInSeconds, setRoundTimeInSeconds] = useState(30);

  const ONE_SECOND = 100;
  const audioRef = useRef<HTMLAudioElement>(null);

  // Update remaining time when round time changes
  useEffect(() => {
    setRemainingTime(roundTimeInSeconds);
  }, [roundTimeInSeconds]);

  // Main timer effect
  useEffect(() => {
    let timerId: number | undefined;

    if (active && remainingTime > 0) {
      timerId = window.setInterval(() => {
        setRemainingTime(prevTime => {
          if (prevTime <= 1) {
            // Play sound when timer ends
            if (audioRef.current) {
              playAudioBak(audioRef, audioEnabled);
            }

            // Always move to next round and reset timer
            setTimeout(() => {
              setCurrentRound(prevRound => prevRound + 1);
              setRemainingTime(roundTimeInSeconds);
            }, 0);
            return 0;
          }
          return prevTime - 1;
        });
      }, ONE_SECOND);
    } else if (breakActive && breakRemaining > 0) {
      timerId = window.setInterval(() => {
        setBreakRemaining(prevTime => prevTime - 1);
      }, ONE_SECOND);
    } else if (breakActive && breakRemaining === 0) {
      // End break
      if (audioRef.current) {
        playAudioBak(audioRef, audioEnabled);
      }
      setBreakActive(false);
      setBreakRemaining(breakTime);
    }

    return () => {
      if (timerId) window.clearInterval(timerId);
    };
  }, [active, breakActive, breakRemaining, breakTime, audioEnabled, roundTimeInSeconds, blinds.length]);

  // Toggle timer
  const toggleTimer = () => setActive(!active);

  // Reset timer
  const resetTimer = () => {
    setActive(false);
    setCurrentRound(0);
    setRemainingTime(roundTimeInSeconds);
    setBreakActive(false);
    setBreakRemaining(breakTime);
  };

  // Start/end break
  const toggleBreak = () => {
    if (breakActive) {
      setBreakActive(false);
      setBreakRemaining(breakTime);
    } else {
      setActive(false);
      setBreakActive(true);
    }
  };

  // Update break time - include the multiplication by 60
  const handleBreakTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseInt(e.target.value, 10) * 60;  // Put the * 60 back
    setBreakTime(time);
    setBreakRemaining(time);
  };

  // Set initial game blinds
  const setInitialGameBlinds = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    const gameBlinds = intializeBlindsForNewGame(parseInt(evt.target.value, 10));
    setBlinds(gameBlinds);
  }

  // Add keyboard event listener for spacebar
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Only handle spacebar if settings are not open
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
