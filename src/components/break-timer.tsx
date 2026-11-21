import { useEffect, useEffectEvent } from 'react';
import { formatTimeMMSS, pauseBetweenRounds, playAudio } from '../utils';
import { useGameEngine } from '../game-engine';
import { useCountdown } from '../hooks/use-countdown';

const PAUSE_AFTER_BREAK_HORN_MILLIS = 1_500;
const PLAY_HORN_ONCE = 1;

export const BreakTimer = ({ breakDurationSeconds }) => {
  const engine = useGameEngine()
  const { hasGameStarted, setGameIsRunning } = engine

  const soundBreakEndHorn = () => playAudio(engine.breakEndAudioRef, engine.isAudioEnabled, PLAY_HORN_ONCE);

  const countdown = useCountdown({
    durationSeconds: breakDurationSeconds,
    isRunning: hasGameStarted,
    onComplete: soundBreakEndHorn,
  });

  useEffect(function keepRoundClockPausedForWholeBreak() {
    if (hasGameStarted) setGameIsRunning(false)
  }, [hasGameStarted, setGameIsRunning])

  const endBreak = useEffectEvent(() => engine.endBreak())

  useEffect(function resumePlayShortlyAfterBreakHorn() {
    if (!countdown.isFinished) return;

    const timeoutId = pauseBetweenRounds(PAUSE_AFTER_BREAK_HORN_MILLIS, endBreak)

    return () => clearTimeout(timeoutId)
  }, [countdown.isFinished])

  return (
    <div id="lightbox" onClick={(evt) => {
      evt.stopPropagation()
      engine.endBreak()
    }}>
      <div className="break-display">
        <h2>BREAK TIME</h2>
        <div className="time-remaining">{formatTimeMMSS(countdown.remainingSeconds)}</div>
      </div>
    </div>
  )
};
