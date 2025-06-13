const matchmaking = require('./matchmaking');

/**
 * Set the next game for a room
 * @param roomName the room's name
 */
function setNextGame(roomName) {
  const gameId = 0;
  const room = matchmaking.getRoom(roomName);
  room.status = 'game-result';
  room.game = gameId;
  room.gameState = {};
}

module.exports = {
  setNextGame
}