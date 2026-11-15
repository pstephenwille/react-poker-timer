import { act, useEffect, useMemo, useRef, useState } from 'react';
import { formatTimeMMSS, playAudio, startConfettiCelebration } from '../utils';



export const RoundTimer = ({
  audioRef,
  audioEnabled,
  roundTimeInSeconds,
  active,
  handleRoundEnd,
  currentBlind,
  currentRound,
  resetGameToggle,
  toggleBreak
}) => {

  const [smallBlind, bigBlind] = useBlindsDisplayHook(currentBlind)
  const [remainingTime, setRemainingTime] = useState(roundTimeInSeconds)
  console.log('%c...round-timer', 'color:gold',remainingTime, roundTimeInSeconds);

  useEffect(function updateRoundTimePerUserChoice(){
      setRemainingTime(roundTimeInSeconds)
  }, [roundTimeInSeconds])

useEffect(()=>{
  setRemainingTime(roundTimeInSeconds)
}, [resetGameToggle])

  useEffect(function triggerBreakToColorUp() {
    if (currentBlind.small === 25) {
      toggleBreak()
    }
  }, [currentBlind]);

  useEffect(() => {
    if (!active) return;

    const timerId = window.setInterval(() => {
      if (remainingTime <= 1) {
        startConfettiCelebration()
        playAudio(audioRef, true);

        pauseBetweenRounds(3_000, () => {
          setRemainingTime(roundTimeInSeconds)
          handleRoundEnd()
        })
      }
      if (remainingTime > 0) {
        setRemainingTime(remainingTime - 1)
      } else {
        clearInterval(timerId)
      }
    }, 1_00)

    return () => {
      clearInterval(timerId)}
  }, [active, remainingTime])

  return (
    <div className="blinds-display">
      {smallBlind}

      <div className="time-remaining">
        <p className={'current-level'}>
          Round: {currentRound + 1}
        </p>
        <h2>{formatTimeMMSS(remainingTime)}</h2>
      </div>

      {bigBlind}

    </div>
  )
}


const pauseBetweenRounds = (pauseMillis, workToDo) => {
  const timeoutId = setTimeout(() => {
    workToDo()
    clearTimeout(timeoutId)
  }, pauseMillis)
}

const useBlindsDisplayHook = (currentBlind) => {
  const [smallBlind, bigBlind] = useMemo(() => {
    return [
      (
        <div className="small-blind">
          <p>Small Blind</p>
          <h2>{currentBlind.small}</h2>
        </div>
      ),
      (
        <div className="big-blind">
          <p>Big Blind</p>
          <h2>{currentBlind.big}</h2>
        </div>
      )
    ]
  }, [currentBlind])

  return [smallBlind, bigBlind]
}