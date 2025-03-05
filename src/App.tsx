import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  // State for timer
  const [remainingTime, setRemainingTime] = useState(900); // 15 minutes default
  const [active, setActive] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [blinds, setBlinds] = useState([
    { small: 25, big: 50, time: 900 },
    { small: 50, big: 100, time: 900 },
    { small: 75, big: 150, time: 900 },
    { small: 100, big: 200, time: 900 },
    { small: 150, big: 300, time: 900 },
    { small: 200, big: 400, time: 900 },
    { small: 300, big: 600, time: 900 },
    { small: 400, big: 800, time: 900 },
    { small: 500, big: 1000, time: 900 },
    { small: 750, big: 1500, time: 900 },
    { small: 1000, big: 2000, time: 900 },
    { small: 1500, big: 3000, time: 900 },
    { small: 2000, big: 4000, time: 900 },
    { small: 3000, big: 6000, time: 900 },
    { small: 4000, big: 8000, time: 900 },
    { small: 5000, big: 10000, time: 900 },
  ]);
  const [showSettings, setShowSettings] = useState(false);
  const [editingLevel, setEditingLevel] = useState(null);
  const [newLevel, setNewLevel] = useState({ small: 0, big: 0, time: 900 });
  const [breakActive, setBreakActive] = useState(false);
  const [breakTime, setBreakTime] = useState(300); // 5 minutes default
  const [breakRemaining, setBreakRemaining] = useState(300);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const audioRef = useRef(null);

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

        if (currentLevel < blinds.length - 1) {
          setCurrentLevel(prevLevel => prevLevel + 1);
          setRemainingTime(blinds[currentLevel + 1].time);
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
  }, [active, remainingTime, currentLevel, blinds, breakActive, breakRemaining, breakTime, audioEnabled]);

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
    setCurrentLevel(0);
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
    setCurrentLevel(index);
    setRemainingTime(blinds[index].time);
    setActive(false);
  };

  // Add new level
  const addLevel = () => {
    setBlinds([...blinds, { ...newLevel }]);
    setNewLevel({ small: 0, big: 0, time: 900 });
  };

  // Start editing a level
  const startEditLevel = (index) => {
    setEditingLevel(index);
    setNewLevel({ ...blinds[index] });
  };

  // Save edited level
  const saveEditLevel = () => {
    if (editingLevel !== null) {
      const updatedBlinds = [...blinds];
      updatedBlinds[editingLevel] = { ...newLevel };
      setBlinds(updatedBlinds);

      // Update current time if editing the current level
      if (editingLevel === currentLevel) {
        setRemainingTime(newLevel.time);
      }

      setEditingLevel(null);
      setNewLevel({ small: 0, big: 0, time: 900 });
    }
  };

  // Remove a level
  const removeLevel = (index) => {
    const updatedBlinds = blinds.filter((_, i) => i !== index);
    setBlinds(updatedBlinds);

    // Adjust current level if needed
    if (currentLevel >= updatedBlinds.length) {
      setCurrentLevel(updatedBlinds.length - 1);
      if (updatedBlinds.length > 0) {
        setRemainingTime(updatedBlinds[updatedBlinds.length - 1].time);
      }
    } else if (currentLevel === index && updatedBlinds.length > 0) {
      setRemainingTime(updatedBlinds[currentLevel < updatedBlinds.length ? currentLevel : 0].time);
    }
  };

  // Update break time
  const handleBreakTimeChange = (e) => {
    const time = parseInt(e.target.value, 10) * 60;
    setBreakTime(time);
    setBreakRemaining(time);
  };

  return (
    <div className="app">
      <audio ref={audioRef} src="assets/horn-alert.wav"/>

      <div className="header">
        <h1>Poker Timer</h1>
        <div className="controls">
          <button onClick={toggleTimer}>{active ? 'Pause' : 'Start'}</button>
          <button onClick={resetTimer}>Reset</button>
          <button onClick={toggleBreak}>
            {breakActive ? 'End Break' : 'Take Break'}
          </button>
          <button onClick={() => setShowSettings(!showSettings)}>
            {showSettings ? 'Hide Settings' : 'Settings'}
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
            <div className="current-level">
              Round: {currentLevel + 1} of {blinds.length}
            </div>
            <div className="blinds-display">
              <div className="small-blind">
                Small Blind:
                <h2>{blinds[currentLevel].small}</h2>
              </div>
              <div className="big-blind">
                Big Blind:
                <h2>{blinds[currentLevel].big}</h2>
              </div>
            </div>
            <div className="time-remaining">{formatTime(remainingTime)}</div>
          </>
        )}
      </div>

      {showSettings && (
        <div className="settings-panel">
          <h3>Settings</h3>

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

          <div className="blinds-settings">
            <h4>Blind Levels</h4>
            <table>
              <thead>
              <tr>
                <th>Level</th>
                <th>Small Blind</th>
                <th>Big Blind</th>
                <th>Time (minutes)</th>
                <th>Actions</th>
              </tr>
              </thead>
              <tbody>
              {blinds.map((level, index) => (
                <tr key={index} className={currentLevel === index ? 'current-level-row' : ''}>
                  <td>{index + 1}</td>
                  <td>
                    {editingLevel === index ? (
                      <input
                        type="number"
                        value={newLevel.small}
                        onChange={(e) => setNewLevel({ ...newLevel, small: parseInt(e.target.value, 10) })}
                        min="0"
                      />
                    ) : level.small}
                  </td>
                  <td>
                    {editingLevel === index ? (
                      <input
                        type="number"
                        value={newLevel.big}
                        onChange={(e) => setNewLevel({ ...newLevel, big: parseInt(e.target.value, 10) })}
                        min="0"
                      />
                    ) : level.big}
                  </td>
                  <td>
                    {editingLevel === index ? (
                      <input
                        type="number"
                        value={newLevel.time / 60}
                        onChange={(e) => setNewLevel({ ...newLevel, time: parseInt(e.target.value, 10) * 60 })}
                        min="1"
                        max="60"
                      />
                    ) : (level.time / 60)}
                  </td>
                  <td>
                    {editingLevel === index ? (
                      <button onClick={saveEditLevel}>Save</button>
                    ) : (
                      <>
                        <button onClick={() => updateBlindLevel(index)}>Go to</button>
                        <button onClick={() => startEditLevel(index)}>Edit</button>
                        <button onClick={() => removeLevel(index)}>Remove</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              </tbody>
            </table>

            <div className="add-level">
              <h4>Add New Level</h4>
              <div>
                <label>Small Blind:</label>
                <input
                  type="number"
                  value={newLevel.small}
                  onChange={(e) => setNewLevel({ ...newLevel, small: parseInt(e.target.value, 10) })}
                  min="0"
                />
              </div>
              <div>
                <label>Big Blind:</label>
                <input
                  type="number"
                  value={newLevel.big}
                  onChange={(e) => setNewLevel({ ...newLevel, big: parseInt(e.target.value, 10) })}
                  min="0"
                />
              </div>
              <div>
                <label>Time (minutes):</label>
                <input
                  type="number"
                  value={newLevel.time / 60}
                  onChange={(e) => setNewLevel({ ...newLevel, time: parseInt(e.target.value, 10) * 60 })}
                  min="1"
                  max="60"
                />
              </div>
              <button onClick={addLevel}>Add Level</button>
            </div>
          </div>
        </div>
      )}

      <div className="next-levels">
        <h3>Upcoming Blinds</h3>
        <div className="levels-list">
          {blinds.slice(currentLevel + 1, currentLevel + 4).map((level, index) => (
            <div key={index} className="level-item">
              <div>Level {currentLevel + index + 2}</div>
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
