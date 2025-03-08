import React from 'react';

export const ROUND_TIMES = [1, 5, 10, 15, 20, 25, 30];
export const ALL_BLINDS = [
  { small: 5, big: 10, time: 900 },
  { small: 10, big: 25, time: 900 },
  { small: 25, big: 50, time: 900 },
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
]

// Function to play audio safely
export const playAudio = (audioRef: React.RefObject<HTMLAudioElement | null>) => {
  if (!audioRef.current) return;
  
  let reapeatXTimes = 3;
  audioRef.current.onended = () => {
    --reapeatXTimes;
    if (reapeatXTimes > 0 && audioRef.current) {
      audioRef.current.play();
    }
  }

  audioRef.current.play();
}

/* @deprecated */
export const playAudioBak = async (audioRef: React.RefObject<HTMLAudioElement | null>, audioEnabled: boolean) => {
  if (audioEnabled && audioRef.current) {
    let playCount = 0;
    const maxPlays = 3;

    const playSound = async () => {
      if (playCount < maxPlays && audioRef.current) {
        try {
          audioRef.current.currentTime = 0; // Reset to start
          await audioRef.current.play();
          playCount++;

          // Set up the next play after this one finishes
          if (playCount < maxPlays) {
            return new Promise((resolve) => {
              if (audioRef.current) {
                audioRef.current.onended = () => {
                  playSound().then(resolve);
                };
              }
            });
          }
        } catch (error) {
          console.error('Error playing audio:', error);
        }
      }
    };

    try {
      await playSound();
    } catch (error) {
      console.error('Error in playAudio:', error);
    }
  }
};

// Format time to MM:SS
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Initialize blinds for new game
export const intializeBlindsForNewGame = (selectedBlind: number) => {
  const gameBlinds = ALL_BLINDS.filter(blind => blind.small >= selectedBlind);
  console.log('%c...game', 'color:gold', gameBlinds);
  return gameBlinds;
}

// Update blind level
export const updateBlindLevel = (
  index: number,
  setCurrentRound: (index: number) => void,
  setRemainingTime: (time: number) => void,
  blinds: Array<{ time: number }>,
  setActive: (active: boolean) => void
) => {
  setCurrentRound(index);
  setRemainingTime(blinds[index].time);
  setActive(false);
};

// Add new level
export const addLevel = (
  blinds: Array<any>,
  setBlinds: (blinds: Array<any>) => void,
  newRound: { small: number; big: number; time: number },
  setNewRound: (round: { small: number; big: number; time: number }) => void
) => {
  setBlinds([...blinds, { ...newRound }]);
  setNewRound({ small: 0, big: 0, time: 900 });
};

// Start editing a level
export const startEditLevel = (
  index: number,
  setEditingRound: (index: number) => void,
  setNewRound: (round: any) => void,
  blinds: Array<any>
) => {
  setEditingRound(index);
  setNewRound({ ...blinds[index] });
};

// Save edited level
export const saveEditLevel = (
  editingRound: number | null,
  newRound: any,
  blinds: Array<any>,
  setBlinds: (blinds: Array<any>) => void,
  currentRound: number,
  setRemainingTime: (time: number) => void,
  setEditingRound: (round: number | null) => void,
  setNewRound: (round: any) => void
) => {
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
export const removeLevel = (
  index: number,
  blinds: Array<any>,
  setBlinds: (blinds: Array<any>) => void,
  currentRound: number,
  setCurrentRound: (round: number) => void,
  setRemainingTime: (time: number) => void
) => {
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
