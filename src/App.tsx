import { act, useEffect, useLayoutEffect, useRef, useState } from 'react'
import './App.css'
import { Settings } from './settings.tsx';
import { ALL_BLINDS, intializeBlindsForNewGame, ROUND_TIMES } from "./utils.ts";

function App() {
  // State for timer
  const [remainingTime, setRemainingTime] = useState(900); // 15 minutes default
  const [active, setActive] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [blinds, setBlinds] = useState(ALL_BLINDS);
  const [showSettings, setShowSettings] = useState(false);
  const [editingRound, setEditingRound] = useState(null);
  const [newRound, setNewRound] = useState({ small: 0, big: 0, time: 900 });
  const [breakActive, setBreakActive] = useState(false);
  const [breakTime, setBreakTime] = useState(300); // 5 minutes default
  const [breakRemaining, setBreakRemaining] = useState(300);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const [roundTimeInSeconds, setRoundTimeInSeconds] = useState(300);
  const ONE_SECOND = 1000;

  const audioRef = useRef(null);


  useEffect(()=>{
    console.log('%c...rountime', 'color:gold', roundTimeInSeconds)
    let timer = 0;
    if (active && roundTimeInSeconds) {
      timer = setInterval(()=>{
          setRemainingTime(roundTimeInSeconds - 1)
      }, ONE_SECOND)
    }
    if (!roundTimeInSeconds) {
      clearInterval(timer)
    }
  }, [active, roundTimeInSeconds])

  // Handle timer
  useEffect(() => {
    let interval = null;

    if (active && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime(prevTime => prevTime - 1);
      }, 1000);
    } else if (breakActive && breakRemaining > 0) {
      interval = setInterval(() => {
        setBreakRemaining(prevTime => prevTime - 1);
      }, 1000);
    } else if ((active && remainingTime === 0) || (breakActive && breakRemaining === 0)) {
      if (active) {
        // Play sound when timer ends
        if (audioEnabled && audioRef.current) {
          audioRef.current.play();
        }

        if (currentRound < blinds.length - 1) {
          setCurrentRound(prevLevel => prevLevel + 1);
          setRemainingTime(blinds[currentRound + 1].time);
        } else {
          setActive(false);
        }
      } else if (breakActive) {
        // End break
        if (audioEnabled && audioRef.current) {
          audioRef.current.play();
        }
        setBreakActive(false);
        setBreakRemaining(breakTime);
      }
    }

    return () => clearInterval(interval);
  }, [active, remainingTime, currentRound, blinds, breakActive, breakRemaining, breakTime, audioEnabled]);

  useLayoutEffect(() => {
    audioRef.current.play();

  }, [showSettings])
  // Format time to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Toggle timer
  const toggleTimer = () => {
    setActive(!active);
  };

  // Reset timer
  const resetTimer = () => {
    setActive(false);
    setCurrentRound(0);
    setRemainingTime(blinds[0].time);
    setBreakActive(false);
    setBreakRemaining(breakTime);
  };

  // Start/end break
  const toggleBreak = () => {
    if (breakActive) {
      // End break early
      setBreakActive(false);
      setBreakRemaining(breakTime);
    } else {
      // Start break
      setActive(false);
      setBreakActive(true);
    }
  };

  // Update blind level
  const updateBlindLevel = (index) => {
    setCurrentRound(index);
    setRemainingTime(blinds[index].time);
    setActive(false);
  };

  // Add new level
  const addLevel = () => {
    setBlinds([...blinds, { ...newRound }]);
    setNewRound({ small: 0, big: 0, time: 900 });
  };

  // Start editing a level
  const startEditLevel = (index) => {
    setEditingRound(index);
    setNewRound({ ...blinds[index] });
  };

  // Save edited level
  const saveEditLevel = () => {
    if (editingRound !== null) {
      const updatedBlinds = [...blinds];
      updatedBlinds[editingRound] = { ...newRound };
      setBlinds(updatedBlinds);

      // Update current time if editing the current level
      if (editingRound === currentRound) {
        setRemainingTime(newRound.time);
      }

      setEditingRound(null);
      setNewRound({ small: 0, big: 0, time: 900 });
    }
  };

  // Remove a level
  const removeLevel = (index) => {
    const updatedBlinds = blinds.filter((_, i) => i !== index);
    setBlinds(updatedBlinds);

    // Adjust current level if needed
    if (currentRound >= updatedBlinds.length) {
      setCurrentRound(updatedBlinds.length - 1);
      if (updatedBlinds.length > 0) {
        setRemainingTime(updatedBlinds[updatedBlinds.length - 1].time);
      }
    } else if (currentRound === index && updatedBlinds.length > 0) {
      setRemainingTime(updatedBlinds[currentRound < updatedBlinds.length ? currentRound : 0].time);
    }
  };

  // Update break time
  const handleBreakTimeChange = (e) => {
    const time = parseInt(e.target.value, 10) * 60;
    setBreakTime(time);
    setBreakRemaining(time);
  };

  const setInitialGameBlinds = (evt) => {
    const gameBlinds = intializeBlindsForNewGame(evt.target.value)
    setBlinds(gameBlinds)
  }
  return (
    <div className="app">
      <audio controls ref={audioRef} src="assets/playful-casino-slot-machine-bonus-2-183919.mp3"/>


      <div className="header">
        <div className="controls">
          <button onClick={toggleTimer}>{active ? 'Pause' : 'Start'}</button>
          <button onClick={resetTimer}>Reset</button>
          <button onClick={toggleBreak}>
            {breakActive ? 'End Break' : 'Take Break'}
          </button>
          <button onClick={() => setShowSettings(!showSettings)}>
            {showSettings ? 'Hide Settingstsx' : 'Settings'}
          </button>
          <button onClick={() => setAudioEnabled(!audioEnabled)}>
            {audioEnabled ? 'Mute Sound' : 'Enable Sound'}
          </button>
        </div>
      </div>

      <div className="main-display">
        {breakActive ? (
          <div className="break-display">
            <h2>BREAK TIME</h2>
            <div className="time-remaining">{formatTime(breakRemaining)}</div>
          </div>
        ) : (
          <>
            <div className="blinds-display">
              <div className="small-blind">
                Small Blind
                <h2>{blinds[currentRound].small}</h2>
              </div>

              <div className="time-remaining">
                <p className={'current-level'}>
                  Round: {currentRound + 1} of {blinds.length}
                </p>
                {formatTime(remainingTime)}
              </div>

              <div className="big-blind">
                Big Blind
                <h2>{blinds[currentRound].big}</h2>
              </div>
            </div>
          </>
        )}
      </div>
      {/*{showSettings && <Settings blinds={blinds}*/}
      {/*                           setBlinds={setBlinds}/>*/}
      {/*}*/}

      {showSettings && (
        <div className="settings-panel">
          <h3>Settings</h3>
          <div>
            <p>round time</p>
            <select   onChange={(evt)=> {
              setRoundTimeInSeconds(evt.target.value * 60)}}>
              {ROUND_TIMES.map(time=>(<option value={time}>{time}</option>))}
            </select>
          </div>
          <div>
            <p>staring blind</p>
            <select name={'starting-blind'} onChange={setInitialGameBlinds}>
              {ALL_BLINDS.slice(0, 5).map(blind => {
                return (
                  <option value={blind.small}>{blind.small}</option>
                )
              })}
            </select>
          </div>

          <div className="break-settings">
            <h4>Break Duration (minutes)</h4>
            <input
              type="number"
              value={breakTime / 60}
              onChange={handleBreakTimeChange}
              min="1"
              max="60"
            />
          </div>


        </div>
      )}

      <div className="next-levels">
        <h3>Upcoming Blinds</h3>
        <div className="levels-list">
          {blinds.slice(currentRound + 1, currentRound + 4).map((level, index) => (
            <div key={index} className="level-item">
              <div>Level {currentRound + index + 2}</div>
              <div>SB: {level.small} / BB: {level.big}</div>
              <div>{level.time / 60} min</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
