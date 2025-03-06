export const ROUND_TIMES = [5, 10, 15, 20, 25, 30];
export const ALL_BLINDS = [
  { small: 5, big: 10, time: 900 },
  { small: 10, big: 25, time: 900 },
  { small: 25, big: 50, time: 900 },
  { small: 100, big: 200, time: 900 },
  { small: 150, big: 300, time: 900 },
  { small: 200, big: 400, time: 900 },
  { small: 300, big: 600, time: 900 },
  { small: 400, big: 800, time: 900 },
  { small: 500, big: 1000, time: 900 },
  { small: 750, big: 1500, time: 900 },
  { small: 1000, big: 2000, time: 900 },
  { small: 1500, big: 3000, time: 900 },
  { small: 2000, big: 4000, time: 900 },
  { small: 3000, big: 6000, time: 900 },
  { small: 4000, big: 8000, time: 900 },
  { small: 5000, big: 10000, time: 900 },
]
export const intializeBlindsForNewGame =
  (selectedBlind) => {
    const gameBlinds =
      ALL_BLINDS.filter(blind => blind.small >= selectedBlind)
    console.log('%c...game', 'color:gold', gameBlinds)
    return gameBlinds
  }
