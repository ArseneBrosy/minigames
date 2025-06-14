let waitingPlayer = null;
let roomIdCounter = 1;
let publicRoomName = `public-${roomIdCounter++}`;

const rooms = {};

/**
 * Generate a random combinaison of 5 letters and numbers
 * @returns {string} the random code
 */
function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Get the room object of a room name
 * @param room the room name
 * @returns {*} the room object
 */
function getRoom(room) {
  return rooms[room];
}

/**
 * Find a room for the player or create one
 * @param playerId the ID of the player to place in a room
 * @param attributes the attributes of the player
 * @returns {*} the room of the player
 */
function addPlayer(playerId, attributes) {
  // Find the player's room
  let roomName = publicRoomName;
  const privateRoom = attributes.private;
  if (privateRoom) {
    //get the room ID
    const roomID = attributes.roomId !== null ? attributes.roomId : generateCode();
    roomName = `private-${roomID}`
  }

  // Initialize the room if it doesn't exist
  let newRoom = false;
  if (!rooms[roomName]) {
    newRoom = true;
    rooms[roomName] = {
      createdAt: Date.now(),
      name: roomName,
      players: [],
      status: 'waiting',
      gameIndex: 0,
      results: [0, 0, 0, 0, 0, 0, 0],
      game: null,
      gameState: {}
    };
  }

  // Add the player to the room's object
  rooms[roomName].players.push({
    id: playerId,
    pseudo: attributes.pseudo,
    picture: attributes.picture,
  });

  // check if it's the first player in it's room
  if (newRoom) {
    if (!privateRoom) {
      waitingPlayer = playerId;
    }
  } else {
    // Start the room
    console.log(`Room ${roomName} started`);

    // Set the room to full
    rooms[roomName].status = 'full';

    // reset for next public room
    if (!privateRoom) {
      waitingPlayer = null;
      publicRoomName = `public-${roomIdCounter++}`;
    }
  }

  return rooms[roomName];
}

/**
 * Get the room in wich a player is placed
 * @param playerId the player's ID
 * @returns {*|null} the room name of the player
 */
function getPlayerRoom(playerId) {
  for (let room of Object.values(rooms)) {
    for (let player of room.players) {
      if (player.id === playerId) {
        return room.name;
      }
    }
  }

  return null;
}

/**
 * Remove a player from the game
 * @param playerId the player's ID
 */
function removePlayer(playerId) {
  if (waitingPlayer === playerId) {
    waitingPlayer = null;
    delete rooms[publicRoomName];
  }
}

module.exports = {
  addPlayer,
  removePlayer,
  getRoom,
  getPlayerRoom
}
