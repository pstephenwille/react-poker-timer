import { useEffect, useEffectEvent, useReducer, useRef, useState } from 'react';
import { formatTimeMMSS, ONE_SECOND, pauseBetweenRounds, playAudio, TIME_COUNTER_MULTIPLIER } from '../utils';
import { useGameEngine } from '../game-engine-context';

export const BreakTimer = ({ breakDurationSeconds }) => {
  const engine = useGameEngine()
  const [remainingTime, setRemainingTime] = useState(breakDurationSeconds)

  /* TODO: 11/20/26, stephen; start */
  const pauseTimeoutRef = useRef(null)
  const onIntervalTick = useEffectEvent((endTimeMillis, intervalId, delayId,) => {
    const remainingMillis = endTimeMillis - Date.now();
    const nextSeconds = Math.max(0, Math.ceil(remainingMillis /1_000))

    setRemainingTime((prev) => prev !== nextSeconds ? nextSeconds : prev);

    if (nextSeconds <= 0) {
      clearInterval(intervalId);
      playAudio(engine.breakEndAudioRef, engine.isAudioEnabled, 1)

     pauseTimeoutRef.current = pauseBetweenRounds(1_500, () => {
       pauseTimeoutRef.current = null
        engine.toggleBreakIsActive(false)
        engine.setGameIsRunning(true);
      })
    }
  })

  useEffect(function runBreakTimer(){
    if (!engine.hasGameStarted) return;

    engine.setGameIsRunning(false)

    const endTimeMillis = Date.now() + (remainingTime * 1_000) / TIME_COUNTER_MULTIPLIER;
    const delayId: number | null = null;

    const intervalId = setInterval(()=>{
        onIntervalTick(endTimeMillis, intervalId, delayId)
    }, 250)

    return ()=>{
      clearInterval(intervalId)
      clearTimeout(pauseTimeoutRef.current)
      if (delayId !== null) clearTimeout(delayId);
    }
  }, [remainingTime])
  /* TODO: 11/20/26, stephen; end */


  useEffect(() => {
    return
    if (!engine.hasGameStarted) return;

    engine.setGameIsRunning(false)

    const timerId = window.setInterval(() => {
      if (remainingTime > 0) {
        setRemainingTime(remainingTime - 1)
      } else {
        engine.toggleBreakIsActive(false)
        playAudio(engine.breakEndAudioRef, engine.isAudioEnabled, 1)

        pauseBetweenRounds(1_500, () => {
          engine.setGameIsRunning(true);
        })
        clearInterval(timerId)
      }
    }, ONE_SECOND);

    return () => clearInterval(timerId)
  }, [remainingTime])

  return (
    <div id="lightbox" onClick={(evt) => {
      evt.stopPropagation()
      engine.toggleBreakIsActive()
      engine.setGameIsRunning(engine.hasGameStarted)
    }}>
      <div className="break-display">
        <h2>BREAK TIME</h2>
        <div className="time-remaining">{formatTimeMMSS(remainingTime)}</div>
      </div>
    </div>
  )
};
