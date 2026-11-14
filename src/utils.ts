import React from 'react';

export const ROUND_TIMES = [1, 5, 10, 15, 20, 25, 30];
export const ALL_BLINDS: Array<{ small: number, big: number }> = [
  { small: 5, big: 10 },
  { small: 10, big: 20 },
  { small: 15, big: 30 },
  { small: 25, big: 50 },
  { small: 50, big: 100 },
  { small: 75, big: 150 },
  { small: 100, big: 200 },
  { small: 200, big: 400 },
  { small: 300, big: 600 },
  { small: 400, big: 800 },
  { small: 500, big: 1000 },
]

export const playAudio = (audioRef: React.RefObject<HTMLAudioElement | null>, audioEnabled: boolean = false) => {
  if (!audioRef.current) return;
  if(audioEnabled === false) return;

  let reapeatXTimes = 3;
  audioRef.current.onended = () => {
    --reapeatXTimes;
    if (reapeatXTimes > 0 && audioRef.current) {
      audioRef.current.play();
    }
  }

  audioRef.current.play();
}

export const formatTimeMMSS = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const initializeBlindsForNewGame = (selectedBlind: number) => {
  const gameBlinds = ALL_BLINDS.filter(blind => blind.small >= selectedBlind);
  return gameBlinds;
}

