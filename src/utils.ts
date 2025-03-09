import React from 'react';
export const DEFAULT_STARING_ROUND_TIME_SECONDS = 600;
export const ROUND_TIMES = [5, 10, 15, 20, 25, 30];
export const ALL_BLINDS: Array<{ small: number, big: number }> = [
  { small: 5, big: 10 },
  { small: 10, big: 25 },
  { small: 25, big: 50 },
  { small: 50, big: 100 },
  { small: 100, big: 200 },
  { small: 200, big: 400 },
  { small: 400, big: 800 },
  { small: 1000, big: 2000 },
  { small: 1500, big: 3000 },
  { small: 2000, big: 4000 },
  { small: 3000, big: 6000 },
  { small: 4000, big: 8000 },
  { small: 5000, big: 10000 }
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

