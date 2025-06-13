const matchmaking = require('./matchmaking');

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

module.exports = {
  setNextGame
}