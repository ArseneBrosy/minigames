//region Game modules
import * as buzzer from "./games/buzzer.js";

const gameModules = [buzzer];
//endregion

const GAME_NAMES = [
  'Buzzer'
];

//region HTML Objects
const resultBar = document.querySelector('.result-bar');
const nextGameName = document.querySelector('#next-game-name');
const timerText = document.querySelector('#next-game-timer');
const playerPoints = document.querySelector('#players-points');
const canvas = document.querySelector('#game');
const ctx = canvas.getContext('2d');
//endregion

//region VARIABLES
let nextGameTimer = 5;
let nextGameTimerInterval = null;
let currentGame = null;
//endregion

canvas.width = 1920;
canvas.height = 1080;

/**
 * Show the last game result
 * @param results the result of the party
 * @param nextGameId the next game's id
 */
function showGameResults(results, nextGameId) {
  // set the results
  let resultsHTML = '';
  for (let result of results) {
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

  // start the game
  gameModules[currentGame].startGame();
}

/**
 * Receive a game event and dispatch it to the correct game function
 * @param name name of the event
 * @param value value of the event
 */
function gameEvent(name, value) {
  gameModules[currentGame].gameEvent(name, value);
}

/**
 * Send the server an input from the player
 * @param input the input to send
 */
function sendInput(input) {
  document.dispatchEvent(new CustomEvent('player-input', { detail: input }));
}

/**
 * Set the players points texts
 * @param points the players points
 */
function setPoints(points) {
  playerPoints.innerHTML = `
  <p>${points[0]}</p>
  <p>•</p>
  <p>${points[1]}</p>`;
}

export { showGameResults, startNextGame, gameEvent, sendInput, setPoints, ctx };