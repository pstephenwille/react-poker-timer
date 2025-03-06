export const Settings = ({blinds, setBlinds})=>{
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
  return(
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

  )
}
