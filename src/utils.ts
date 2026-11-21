import React from 'react';
import { confetti } from '@tsparticles/confetti';

export const TIME_COUNTER_MULTIPLIER = 1;
export const DEFAULT_ROUND_SECONDS = 600
export const DEFAULT_BREAK_SECONDS = 600
export const ROUND_TIMES = [1, 5, 10, 15, 20, 25, 30];
export const BREAK_TIMES = [1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];
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
const CONFETTI_CANVAS_ID = 'confetti-canvas';
const LEFT_EDGE_X = 0;
const RIGHT_EDGE_X = 1;
const NEAR_BOTTOM_Y = 0.9;
const ANGLE_UP_AND_RIGHT = 60;
const ANGLE_UP_AND_LEFT = 120;

const launchConfettiBurst = (originX: number, angle: number) => {
  confetti(CONFETTI_CANVAS_ID, {
    particleCount: 75,
    startVelocity: 75,
    spread: 100,
    angle,
    origin: { x: originX, y: NEAR_BOTTOM_Y },
    colors: brandColors
  });
};

const launchConfettiBurstFromLeftEdge = () => launchConfettiBurst(LEFT_EDGE_X, ANGLE_UP_AND_RIGHT);

const launchConfettiBurstFromRightEdge = () => launchConfettiBurst(RIGHT_EDGE_X, ANGLE_UP_AND_LEFT);

export function startConfettiCelebration(durationInSeconds = 3) {
  const celebrationEndTime = Date.now() + durationInSeconds * 1_000;
  const isCelebrationStillRunning = () => Date.now() < celebrationEndTime;

  function launchBurstsEveryFrameUntilCelebrationEnds() {
    launchConfettiBurstFromLeftEdge();
    launchConfettiBurstFromRightEdge();

    if (isCelebrationStillRunning()) {
      requestAnimationFrame(launchBurstsEveryFrameUntilCelebrationEnds);
    }
  }

  requestAnimationFrame(launchBurstsEveryFrameUntilCelebrationEnds);
}

export const pauseBetweenRounds = (pauseMillis, workToDo) => {
  return setTimeout(() => {
    workToDo()
  }, pauseMillis)
}

