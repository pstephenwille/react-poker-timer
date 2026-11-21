import React from 'react';
import { confetti } from '@tsparticles/confetti';

export const TIME_COUNTER_MULTIPLIER = 10;
export const DEFAULT_ROUND_SECONDS = 60
export const DEFAULT_BREAK_SECONDS = 60
export const ONE_SECOND = 1_00;
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

export const playAudio = (
  audioRef: React.RefObject<HTMLAudioElement | null>,
  audioEnabled: boolean = false,
  repeatXTimes: number = 3
) => {
  if (!audioRef.current) return;
  if (audioEnabled === false) return;

  audioRef.current.onended = () => {
    --repeatXTimes;
    if (repeatXTimes > 0 && audioRef.current) {
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
  return ALL_BLINDS.filter(blind => blind.small >= selectedBlind);
}

const brandColors = ['#ffffff', '#000000'];

export function startConfettiCelebration(durationInSeconds = 3) {
  const endTime = Date.now() + durationInSeconds * 1_000;

  function frame() {
    // Launch a small burst from the left edge
    confetti('confetti-canvas', {
      particleCount: 75,
      angle: 60,
      startVelocity: 75,
      spread: 100,
      origin: { x: 0, y: 0.9 },
      colors: brandColors
    });

    // Launch a small burst from the right edge
    confetti('confetti-canvas', {
      particleCount: 75,
      startVelocity: 75,
      angle: 120,
      spread: 100,
      origin: { x: 1, y: 0.9 },
      colors: brandColors
    });

    // Keep looping until the timer expires
    if (Date.now() < endTime) {
      requestAnimationFrame(frame);
    }
  }

  requestAnimationFrame(frame);
}

export const pauseBetweenRounds = (pauseMillis, workToDo) => {
  return setTimeout(() => {
    workToDo()
  }, pauseMillis)
}

