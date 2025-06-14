const eventBus = require('./eventBus');

/**
 * Send an event to a room
 * @param roomName the name of the room
 * @param name the name of the event
 * @param value the value of the event
 */
function emit(roomName, name, value = null) {
  eventBus.emit('game-event', {
    room : roomName,
    name : name,
    value : value
  });
  console.log(`game event in ${roomName} : ${name}, value : ${value}`);
}

/**
 * End the game in a room
 * @param roomName the name of the room
 * @param winner the winner of the game
 */
function endGame(roomName, winner) {
  eventBus.emit('game-end', {
    room : roomName,
    winner : winner
  });
  console.log(`game ended in ${roomName}. winner : ${winner}`);
}

module.exports = {
  emit,
  endGame
}