import { useEffect, useMemo, useState } from 'react';
import { formatTimeMMSS, ONE_SECOND, playAudio, startConfettiCelebration } from '../utils';
import { useGame } from '../new-game-context';


export const RoundTimer = () => {
  const game = useGame()
  const gameIsRunning = (
    game.status === 'running'
  )
  const currentBlind = game.blinds[game.currentRound]
  console.log('%c...xxx', 'color:gold', gameIsRunning, currentBlind);

  const [smallBlind, bigBlind] = useBlindsDisplayHook(currentBlind)
  const [remainingTime, setRemainingTime] = useState(game.roundDurationSeconds)

  useEffect(function updateRoundTimePerUserChoice() {
    setRemainingTime(game.roundDurationSeconds)
  }, [game.roundDurationSeconds])

  useEffect(() => {
    // reset to default
    setRemainingTime(game.roundDurationSeconds)
  }, [/*resetGameToggle*/])

  useEffect(function triggerBreakToColorUp() {
    if (game.currentRound === 0) return

    if (currentBlind.small === 25) {
      game.toggleBreakIsActive({ startBreak: true })
    }
  }, [currentBlind, game.currentRound]);

  useEffect(() => {
    if (!gameIsRunning) return;

    const timerId = window.setInterval(() => {
      console.log('%c...timer', 'color:gold', game.roundDurationSeconds);

      if (remainingTime <= 1) {
        startConfettiCelebration()
        playAudio(game.audioRef, true);

        pauseBetweenRounds(3_000, () => {
          setRemainingTime(game.roundDurationSeconds)
          // handleRoundEnd()
        })
      }
      if (remainingTime > 0) {
        setRemainingTime(remainingTime - 1)
      } else {
        clearInterval(timerId)
      }
    }, ONE_SECOND)

    return () => {
      clearInterval(timerId)
    }
  }, [gameIsRunning, remainingTime])

  return (
    <div id={'main-display'} className="main-display">

      <div className="blinds-display">
        {smallBlind}

        <div className="time-remaining">
          <p className={'current-level'}>
            Round: {game.currentRound + 1}
          </p>
          <h2>{formatTimeMMSS(remainingTime)}</h2>
        </div>

        {bigBlind}

      </div>
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