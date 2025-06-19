const GAME_NAMES = [
  'Buzzer'
];

//region HTML Objects
const resultBar = document.querySelector('.result-bar');
const nextGameName = document.querySelector('#next-game-name');
const timerText = document.querySelector('#next-game-timer');
//endregion

//region VARIABLES
let nextGameTimer = 5;
let nextGameTimerInterval = null;
let currentGame = null;
//endregion

/**
 * Show the last game result
 * @param results the result of the party
 * @param nextGameId the next game's id
 */
function showGameResults(results, nextGameId) {
  // set the results
  let resultsHTML = '';
  for (result of results) {
    resultsHTML += `<div class="res${result}"></div>`
  }
  resultBar.innerHTML = resultsHTML;

  // set the next game
  currentGame = nextGameId;
  nextGameName.innerText = GAME_NAMES[nextGameId];

  // start the timer
  timerText.innerText = nextGameTimer;
  nextGameTimerInterval = setInterval(() => {
    if (nextGameTimer > 0) {
      nextGameTimer--;
    }
    timerText.innerText = nextGameTimer;
  }, 1000);

  openMenu('game-result-menu', true);
}

/**
 * Start the next game
 */
function startNextGame() {
  openMenu('game-menu', true);

  // reset timer
  clearInterval(nextGameTimerInterval);
  nextGameTimer = 5;
}

/**
 * Receive a game event and dispatch it to the correct game function
 * @param name name of the event
 * @param value value of the event
 */
function gameEvent(name, value) {
  console.log('game event :', name, value);
}