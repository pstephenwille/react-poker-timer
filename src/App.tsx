import { useCallback, useReducer, useRef, useState } from 'react'
import './App.css'
import { ALL_BLINDS, initializeBlindsForNewGame } from "./utils.ts";
import { Header } from "./components/header.tsx";
import { MainDisplay } from './components/main-display.tsx';
import { BlindsSchedule } from './components/blinds-schedule.tsx';


function App() {
  const [resetGameToggle, setResetGameToggle] = useReducer((resetGameToggle) => !resetGameToggle, false)
  const [roundIsActive, setRoundIsActive] = useReducer((roundIsActive, override) => {
    return (
      typeof override === 'boolean'
    ) ? override : !roundIsActive
  }, false);
  const [currentRound, setCurrentRound] = useState(0);
  const [blinds, setBlinds] = useState(ALL_BLINDS);
  const [settingsToggle, toggleSettings] = useReducer((toggle) => !toggle, false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [roundTimeInSeconds, setRoundTimeInSeconds] = useState(600);
  const initRoundTimeDisplay = roundTimeInSeconds / 60;
  const audioRef = useRef<HTMLAudioElement>(null);

  const [breakActive, setBreakActive] = useReducer((breakActive) => {
    return !breakActive
  }, false);
  const [breakTime, setBreakTime] = useState(600); // 5 minutes default
  const [breakRemaining, setBreakRemaining] = useState(600);

  // const toggleRoundTimer = useCallback(() => toggleRoundTimer(!roundIsActive), [roundIsActive]);

  const resetTimer = useCallback(() => {
    setResetGameToggle()
    setRoundIsActive(false)
    setCurrentRound(0);
    // setRemainingTime(roundTimeInSeconds);
  }, []);

  const toggleBreak = useCallback(( command ) => {
    if (command?.restartGame) {
      setRoundIsActive(true);
      setBreakActive(false);
    }
    else {
      setRoundIsActive(breakActive);
      setBreakActive();
    }
  }, [ breakActive]);

  const handleBreakTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseInt(e.target.value, 10) * 60;
    setBreakTime(time);
    setBreakRemaining(time);
  };

  const setInitialGameBlinds = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    const gameBlinds = initializeBlindsForNewGame(parseInt(evt.target.value, 10));
    setBlinds(gameBlinds);
  }

  const handleRoundEnd = useCallback(() => {
    setRoundTimeInSeconds(roundTimeInSeconds)
    setCurrentRound(currentRound + 1)
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
        toggleBreak={toggleBreak}
        setRoundIsActive={setRoundIsActive}
        active={roundIsActive}
        resetTimer={resetTimer}
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
        active={roundIsActive}
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

      {/* break-time and round-settings go here */}
    </div>
  );
}

export default App;
