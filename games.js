const matchmaking = require('./matchmaking');
const games = [
  require('./games/buzzer.js')
];

/**
 * Set the next game for a room
 * @param roomName the room's name
 * @returns {*} the new room's state
 */
function setNextGame(roomName) {
  const gameId = 0;
  const room = matchmaking.getRoom(roomName);
  room.status = 'game-result';
  room.game = gameId;
  room.gameState = {};
  return room;
}

/**
 * Apply an input to the current game
 * @param roomName the name of the room
 * @param player the index of the player that sent the input
 * @param input the input
 */
function applyInput(roomName, player, input) {
  const room = matchmaking.getRoom(roomName);
  const gameId = room.game;
  games[gameId].applyInput(room, player, input);
}

module.exports = {
  setNextGame,
  applyInput
}