//region Game modules
import * as lightFingers from "./games/light-fingers.js";

const gameModules = [lightFingers];
//endregion

const GAME_NAMES = [
  'Light fingers'
];

//region HTML Objects
const resultBar = document.querySelector('.result-bar');
const nextGameName = document.querySelector('#next-game-name');
const timerText = document.querySelector('#next-game-timer');
const playerPoints = document.querySelector('#players-points');
const endGameScreen = document.querySelector('#end-game-screen');
const canvas = document.querySelector('#game');
const ctx = canvas.getContext('2d');
//endregion

//region VARIABLES
let nextGameTimer = 5;
let nextGameTimerInterval = null;
let currentGame = null;
let gameLoop = null;
//endregion

canvas.width = 1920;
canvas.height = 1080;

/**
 * Show the end screen
 * @param winner the name of the player who won the game
 */
function endGame(winner) {
  endGameScreen.style.display = 'flex';
  endGameScreen.innerHTML = `<p>${winner.pseudo} gagne</p>`;
  endGameScreen.style.backgroundColor = winner.id === 0 ? '#bd1f1f' : '#1063ff';
  clearInterval(gameLoop);
}

/**
 * Show the last game result
 * @param results the result of the party
 * @param nextGameId the next game's id
 */
function showGameResults(results, nextGameId) {
  // reset the end game screen
  endGameScreen.style.display = 'none';
  endGameScreen.innerHTML = `<p></p>`;
  endGameScreen.style.backgroundColor = 'unset';

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
  gameLoop = setInterval(gameModules[currentGame].drawFrame, 1);
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

export { showGameResults, startNextGame, endGame, gameEvent, sendInput, setPoints, ctx };