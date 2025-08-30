const matchmaking = require('./matchmaking');
const games = [
  require('./games/lightFingers.js')
];

/**
 * Set the next game for a room
 * @param roomName the room's name
 * @returns {*} the new room's state
 */
function setNextGame(roomName) {
  const gameId = Math.floor(Math.random() * games.length);
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

/**
 * Launch a game in a room
 * @param roomName the room in wich the game should be launched
 */
function launchGame(roomName) {
  const room = matchmaking.getRoom(roomName);
  const gameId = room.game;
  games[gameId].launchGame(room);
  room.status = 'game';
}

module.exports = {
  setNextGame,
  applyInput,
  launchGame,
}