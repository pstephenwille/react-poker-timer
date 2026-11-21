import { useEffect, useEffectEvent, useMemo } from 'react';
import {
  formatTimeMMSS,
  pauseBetweenRounds,
  playAudio,
  startConfettiCelebration,
} from '../utils';
import { useGameEngine } from '../game-engine';
import { useCountdown } from '../hooks/use-countdown';

const PAUSE_BETWEEN_ROUNDS_MILLIS = 3_000;
const SMALL_BLIND_THAT_RETIRES_LOWEST_CHIPS = 25;

const getBlindForRound = (blinds, round) => blinds[round] ?? blinds.at(-1);

const isColorUpDue = (completedRound, completedBlind) => {
  const isOpeningRound = completedRound === 0;
  const retiresLowestChips = completedBlind?.small === SMALL_BLIND_THAT_RETIRES_LOWEST_CHIPS;

  return !isOpeningRound && retiresLowestChips;
};

export const RoundTimer = () => {
  const engine = useGameEngine()
  const currentBlind = getBlindForRound(engine.blinds, engine.currentRound)
  const [smallBlind, bigBlind] = useBlindsDisplayHook(currentBlind)

  const celebrateRoundEnd = () => {
    startConfettiCelebration();
    playAudio(engine.roundEndAudioRef, engine.isAudioEnabled);
  };

  const countdown = useCountdown({
    durationSeconds: engine.roundDurationSeconds,
    isRunning: engine.gameIsRunning,
    onComplete: celebrateRoundEnd,
  });

  const isPausedBetweenRounds = engine.gameIsRunning && countdown.isFinished;

  const startColorUpBreakIfDue = (completedRound, completedBlind) => {
    if (isColorUpDue(completedRound, completedBlind)) {
      engine.toggleBreakIsActive(true)
    }
  }

  const advanceToNextRound = useEffectEvent(() => {
    const completedRound = engine.currentRound
    const completedBlind = currentBlind

    countdown.reset()
    engine.incrementCurrentRound()
    startColorUpBreakIfDue(completedRound, completedBlind)
  });

  useEffect(function advanceAfterPauseBetweenRounds() {
    if (!isPausedBetweenRounds) return;

    const timeoutId = pauseBetweenRounds(PAUSE_BETWEEN_ROUNDS_MILLIS, advanceToNextRound)

    return () => clearTimeout(timeoutId)
  }, [isPausedBetweenRounds])


  return (
    <div id={'main-display'} className="main-display">

      <div className="blinds-display">

        {smallBlind}

        <div className="time-remaining">
          <p className={'current-level'}>
            Round: {engine.currentRound + 1}
          </p>
          <h2>{formatTimeMMSS(countdown.remainingSeconds)}</h2>
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
