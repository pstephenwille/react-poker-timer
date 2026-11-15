import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import './App.css'
import { ALL_BLINDS, initializeBlindsForNewGame } from "./utils.ts";
import { Header } from "./components/header.tsx";
import { MainDisplay } from './components/main-display.tsx';
import { BlindsSchedule } from './components/blinds-schedule.tsx';


function App() {
  const [resetGameToggle, setResetGameToggle] = useReducer((resetGameToggle) => !resetGameToggle, false)
  const [remainingTime, setRemainingTime] = useState(10);
  const [active, setActive] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [blinds, setBlinds] = useState(ALL_BLINDS);
  const [settingsToggle, toggleSettings] = useReducer((toggle) => !toggle, false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [roundTimeInSeconds, setRoundTimeInSeconds] = useState(60);
  const ONE_SECOND = 1_00;
  const initRoundTimeDisplay = roundTimeInSeconds / 60;
  const audioRef = useRef<HTMLAudioElement>(null);

  const [breakActive, setBreakActive] = useReducer((breakActive) => !breakActive, false);
  const [breakTime, setBreakTime] = useState(100); // 5 minutes default
  const [breakRemaining, setBreakRemaining] = useState(600);

  const toggleRoundTimer = useCallback(() => setActive(!active), [active]);

  const resetTimer = useCallback(() => {
    setResetGameToggle()
    setActive(false);
    setCurrentRound(0);
    setRemainingTime(roundTimeInSeconds);
    // setBreakActive();
    // setBreakRemaining(breakTime);
  }, []);

  const toggleBreak = useCallback((start) => {
    console.log('%c...start', 'color:white',   start, active);

    toggleRoundTimer()
    // setActive(!active)
    // setBreakActive();
  }, []);

  const handleBreakTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseInt(e.target.value, 10) * 60;
    setBreakTime(time);
    setBreakRemaining(time);
  };

  const setInitialGameBlinds = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    const gameBlinds = initializeBlindsForNewGame(parseInt(evt.target.value, 10));
    console.log('%c...bame-blinds', 'color:white',   gameBlinds);

    setBlinds(gameBlinds);
  }


  useEffect(function updateTimeOnRoundTimeChanges() {
    setRemainingTime(roundTimeInSeconds);
  }, [roundTimeInSeconds]);

  // useEffect(function triggerBreakToColorUp() {
  //   if (blinds[currentRound]?.small === 25) {
  //     setBreakActive()
  //     toggleBreak()
  //   }
  // }, [blinds, currentRound]);


  const handleRoundEnd = useCallback(() => {
    setRoundTimeInSeconds(roundTimeInSeconds)
    setCurrentRound(currentRound + 1)
    setActive(true)
  }, [currentRound])

  return (
    <div className="app">
      <audio
        ref={audioRef}
        src="/assets/jackpot-winner.mp3"
        preload="auto"
      />


      <Header
        breakTime={breakTime}
        initRoundTimeDisplay={initRoundTimeDisplay}
        setRoundTimeInSeconds={setRoundTimeInSeconds}
        setInitialGameBlinds={setInitialGameBlinds}
        handleBreakTimeChange={handleBreakTimeChange}

        toggleTimer={toggleRoundTimer}
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
        toggleBreak={toggleBreak}
        resetGameToggle={resetGameToggle}
        audioRef={audioRef}
        audioEnabled={audioEnabled}
        active={active}
        handleRoundEnd={handleRoundEnd}
        breakTime={breakTime}
        breakActive={breakActive}
        currentRound={currentRound}
        roundTimeInSeconds={roundTimeInSeconds}
        blinds={blinds}
      />

      <BlindsSchedule
        setInitialGameBlinds={setInitialGameBlinds}
        roundTimeInSeconds={roundTimeInSeconds}
        currentRound={currentRound}
        blinds={blinds}
      />


    </div>
  );
}

export default App;
