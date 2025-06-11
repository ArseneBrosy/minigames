const matchmaking = require('./matchmaking');

function startGame(roomName) {
  const gameId = 0;
  rooms[roomName].status = 'game-result';
  rooms[roomName].game = gameId;
  rooms[roomName].gameState = {};
}

module.exports = {
  startGame
}