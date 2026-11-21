import { useCallback, useEffect, useEffectEvent, useReducer, useRef, useState } from 'react';
import { TIME_COUNTER_MULTIPLIER } from '../utils';

const TICK_INTERVAL_MILLIS = 250;
const MILLIS_PER_SECOND = 1_000;

const roundUpToWholeSeconds = (millis: number) => Math.ceil(millis / MILLIS_PER_SECOND);
const toMillis = (seconds: number) => seconds * MILLIS_PER_SECOND;
const countdownMillisToWallClockMillis = (countdownMillis: number) => countdownMillis / TIME_COUNTER_MULTIPLIER;
const wallClockMillisToCountdownMillis = (wallClockMillis: number) => wallClockMillis * TIME_COUNTER_MULTIPLIER;

type CountdownOptions = {
  durationSeconds: number;
  isRunning: boolean;
  onComplete: () => void;
};

export function useCountdown({ durationSeconds, isRunning, onComplete }: CountdownOptions) {
  const exactRemainingMillisRef = useRef(toMillis(durationSeconds));
  const [displayedRemainingSeconds, setDisplayedRemainingSeconds] = useState(durationSeconds);
  const [resetGeneration, restartRunningCountdownFromFullDuration] = useReducer((generation: number) => generation + 1, 0);
  const handleComplete = useEffectEvent(onComplete);

  const hasTimeLeft = () => exactRemainingMillisRef.current > 0;

  useEffect(function tickWhileRunning() {
    if (!isRunning || !hasTimeLeft()) return;

    const wallClockEndTimeMillis = Date.now() + countdownMillisToWallClockMillis(exactRemainingMillisRef.current);
    const measureExactMillisLeft = () => Math.max(0, wallClockMillisToCountdownMillis(wallClockEndTimeMillis - Date.now()));
    let hasCompleted = false;

    const completeCountdown = () => {
      hasCompleted = true;
      exactRemainingMillisRef.current = 0;
      clearInterval(intervalId);
      handleComplete();
    };

    const tick = () => {
      const exactMillisLeft = measureExactMillisLeft();
      setDisplayedRemainingSeconds(roundUpToWholeSeconds(exactMillisLeft));

      if (exactMillisLeft <= 0) completeCountdown();
    };

    const rememberExactTimeLeftSoResumingLosesNothing = () => {
      exactRemainingMillisRef.current = measureExactMillisLeft();
    };

    const intervalId = setInterval(tick, TICK_INTERVAL_MILLIS);

    return function stopTicking() {
      clearInterval(intervalId);

      const savingNowWouldOverwriteTheUpcomingReset = hasCompleted;
      if (!savingNowWouldOverwriteTheUpcomingReset) rememberExactTimeLeftSoResumingLosesNothing();
    };
  }, [isRunning, resetGeneration]);

  const reset = useCallback(() => {
    exactRemainingMillisRef.current = toMillis(durationSeconds);
    setDisplayedRemainingSeconds(durationSeconds);
    restartRunningCountdownFromFullDuration();
  }, [durationSeconds]);

  return {
    remainingSeconds: displayedRemainingSeconds,
    isFinished: displayedRemainingSeconds === 0,
    reset,
  };
}
