const eventBus = require('../eventBus');

function applyInput(room, player, input) {
  console.log(`input, roomName : ${room.name}, player : ${player}, input : ${input}`);
  eventBus.emit('game-event', 'test')
}

module.exports = {
  applyInput
}