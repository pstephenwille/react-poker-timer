import  { useEffect,  useState } from 'react';
import { formatTimeMMSS } from '../utils';

export const BreakTimer = ({breakTime, toggleBreak})=>{
  const [timeRemaining, setTimer] = useState(breakTime)

  useEffect(()=>{
  const timerId = window.setInterval(() => {
    if (timeRemaining > 0) {
      setTimer(timeRemaining - 1)
    }else{
      toggleBreak()
      clearInterval(timerId)
    }
  }, 1_00);

    return ()=>clearInterval(timerId)
  }, [timeRemaining])

  return(
    <div className="break-display">
      <h2>BREAK TIME</h2>
      <div className="time-remaining">{formatTimeMMSS(timeRemaining)}</div>
    </div>
  )
}
