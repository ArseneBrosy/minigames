const event = require('../eventManager');
const MIN_TIME = 3000;
const MAX_TIME = 10000;
const HOLD_TIME = 3000;
const WIN_POINTS = 5;
const ACCEPT_INPUT_TIME = 500;

let acceptInput = false;

/**
 * Fonction that gets called everytime the player performs an input
 * @param room the room in witch a player performed the input
 * @param player the index of the player who performed the input
 * @param input the input
 */
function applyInput(room, player, input) {
  // check that the player isn't on hold
  if (room.gameState.playersOnHold[player]) {
    return;
  }

  if (room.gameState.buzzerOn) {
    // reset the buzzer
    room.gameState.buzzerOn = false;
    setTimeout(() => {
      acceptInput = false;
    }, ACCEPT_INPUT_TIME);

    // give the player a point
    room.gameState.points[player]++;
    event.emit(room.name, 'player-point', player);

    // check if the player has winned the game
    if (room.gameState.points[player] >= WIN_POINTS) {
      event.endGame(room.name, player);
      return;
    }

    // start the buzzer timer again
    startTimer(room);
  } else if (acceptInput) {
    event.emit(room.name, 'player-failed-accepted', player);
  } else {
    // put the player on hold
    room.gameState.playersOnHold[player] = true;

    // inform the players
    event.emit(room.name, 'player-failed', { player : player, time : HOLD_TIME });

    // countdown to activate the player back
    setTimeout(() => {
      room.gameState.playersOnHold[player] = false;
      event.emit(room.name, 'player-back', player);
    }, HOLD_TIME);
  }
}

/**
 * Function that get called at the start of a game
 * @param room the room in witch the game has started
 */
function launchGame(room) {
  room.gameState = {
    buzzerOn: false,
    playersOnHold: [false, false],
    points: [0, 0]
  }
  acceptInput = false;
  console.log(`game launched in room: ${room.name}`);
  startTimer(room);
}

/**
 * Start the random timer for the next time the buzzer will be green
 * @param room the room in witch start the timer
 */
function startTimer(room) {
  setTimeout(() => {
    room.gameState.buzzerOn = true;
    acceptInput = true;
    event.emit(room.name, 'buzzer-on');
  }, Math.floor(Math.random() * (MAX_TIME - MIN_TIME)) + MIN_TIME);
}

module.exports = {
  applyInput,
  launchGame
}