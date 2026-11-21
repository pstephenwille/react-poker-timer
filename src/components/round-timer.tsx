import { useEffect, useEffectEvent, useMemo, useRef, useState } from 'react';
import {
  formatTimeMMSS,
  ONE_SECOND,
  pauseBetweenRounds,
  playAudio,
  startConfettiCelebration,
  TIME_COUNTER_MULTIPLIER
} from '../utils';
import { useGameEngine } from '../game-engine-context';


export const RoundTimer = () => {
  const engine = useGameEngine()
  const currentBlind = engine.currentRound < engine.blinds.length
    ? engine.blinds[engine.currentRound]
    : engine.blinds.at(-1)
  const [smallBlind, bigBlind] = useBlindsDisplayHook(currentBlind)
  const [remainingTime, setRemainingTime] = useState(engine.roundDurationSeconds)
  const [prevDuration, setPrevDuration] = useState(engine.roundDurationSeconds);
  const isAudioEnabledRef = useRef(engine.isAudioEnabled);

  if (engine.roundDurationSeconds !== prevDuration) {
    setPrevDuration(engine.roundDurationSeconds);
    setRemainingTime(engine.roundDurationSeconds);
  }

  useEffect(() => {
    isAudioEnabledRef.current = engine.isAudioEnabled;
  }, [engine.isAudioEnabled]);


  const triggerBreakToColorUp = useEffectEvent(() => {
    if (engine.currentRound === 0) return

    if (currentBlind?.small === 25) {
      engine.toggleBreakIsActive(true)
    }
  })
  /* TODO: 11/20/26, stephen; start */
  const pauseTimeoutId = useRef(null)
  const onTick = useEffectEvent((endTimeMillis, intervalId) => {
    const remainingMs = endTimeMillis - Date.now()
    const nextSeconds = Math.max(0, Math.floor(remainingMs / 1_000))

    setRemainingTime((prev) => prev !== nextSeconds ? nextSeconds : prev);

    if (nextSeconds <= 0) {
      clearInterval(intervalId)
      startConfettiCelebration();
      playAudio(engine.roundEndAudioRef, isAudioEnabledRef.current);

      pauseTimeoutId.current =  pauseBetweenRounds(3_000, () => {
        engine.incrementCurrentRound()
        pauseTimeoutId.current  = null;
        setRemainingTime( engine.roundDurationSeconds);
        triggerBreakToColorUp()
      })
    }
  });

  useEffect(() => {
    console.log('%c...game-timer', 'color:gold',  engine.gameIsRunning);

    if (!engine.gameIsRunning) return;

    const endTimeMillis = Date.now() + (remainingTime * 1_000) / TIME_COUNTER_MULTIPLIER;

    const intervalId = setInterval(() => {
      onTick(endTimeMillis, intervalId)
    }, 250)

    return () => {
      clearInterval(intervalId)
      clearTimeout(pauseTimeoutId.current)
    }
  }, [engine.gameIsRunning, engine.roundDurationSeconds, currentBlind, engine.currentRound])

  /* TODO: 11/20/26, stephen; end */

  useEffect(function devGameTimer() {
    return
    if (!engine.gameIsRunning) return;

    let secondsLeft = remainingTime > 0 ? remainingTime : engine.roundDurationSeconds;
    let delayId: number | null = null;
    const timerId = window.setInterval(() => {
      if (delayId !== null) return;
      if (engine.breakIsActive) return;

      secondsLeft -= 1;
      setRemainingTime(Math.max(0, secondsLeft));

      if (secondsLeft <= 0) {
        startConfettiCelebration();
        playAudio(engine.roundEndAudioRef, isAudioEnabledRef.current);

        delayId = pauseBetweenRounds(3_000, () => {
          engine.incrementCurrentRound()
          delayId = null;
          secondsLeft = engine.roundDurationSeconds;
          setRemainingTime(secondsLeft);
          triggerBreakToColorUp()
        })
      }
    }, ONE_SECOND);


    return () => {
      clearInterval(timerId);
      if (delayId !== null) clearTimeout(delayId);
    };
  }, [engine.gameIsRunning, engine.roundDurationSeconds, currentBlind]);


  return (
    <div id={'main-display'} className="main-display">

      <div className="blinds-display">

        {smallBlind}

        <div className="time-remaining">
          <p className={'current-level'}>
            Round: {engine.currentRound + 1}
          </p>
          <h2>{formatTimeMMSS(remainingTime)}</h2>
        </div>

        {bigBlind}

      </div>
    </div>
  )
};


const useBlindsDisplayHook = (currentBlind) => {
  const [smallBlind, bigBlind] = useMemo(() => {
    return [
      (
        <div className="small-blind">
          <p>Small Blind</p>
          <h2>{currentBlind?.small}</h2>
        </div>
      ),
      (
        <div className="big-blind">
          <p>Big Blind</p>
          <h2>{currentBlind?.big}</h2>
        </div>
      )
    ]
  }, [currentBlind])

  return [smallBlind, bigBlind]
}