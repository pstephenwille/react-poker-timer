import  { useEffect,  useState } from 'react';
import { formatTimeMMSS, ONE_SECOND } from '../utils';
import { useGame } from '../new-game-context';

export const BreakTimer = ({breakDurationSeconds})=>{
  const game = useGame()
  const [timeRemaining, setTimer] = useState(breakDurationSeconds)

  useEffect(()=>{
  const timerId = window.setInterval(() => {
    if (timeRemaining > 0) {
      setTimer(timeRemaining - 1)
    }else{
      game.toggleBreakIsActive({restartGame: true })
      clearInterval(timerId)
    }
  }, ONE_SECOND);

    return ()=>clearInterval(timerId)
  }, [timeRemaining])

  return(
    <div id="lightbox" onClick={(evt)=>{
      evt.stopPropagation()
      toggleBreak()
    }}>
    <div className="break-display">
      <h2>BREAK TIME</h2>
      <div className="time-remaining">{formatTimeMMSS(timeRemaining)}</div>
    </div>
    </div>
  )
}
