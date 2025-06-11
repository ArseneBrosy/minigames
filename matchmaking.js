let waitingPlayer = null;
let roomIdCounter = 1;
let publicRoomName = `public-${roomIdCounter++}`;

const rooms = {};

function getRoom(room) {
  return rooms[room];
}

function addPlayer(playerId, attributes) {
  // Find the player's room
  let roomName = publicRoomName;
  let privateRoom = attributes.roomId !== null;
  if (privateRoom) {
    roomName = `private-${attributes.roomId}`
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
      results: [0, 0, 0, 0, 0, 0, 0],
      game: null,
      gameState: {}
    };
  }

  // Add the player to the room's object
  rooms[roomName].players.push({
    id: playerId
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

function getPlayerRoom(playerId) {
  for (let room of rooms) {
    for (let player of room.players) {
      if (player.id === playerId) {
        return room.name;
      }
    }
  }

  return null;
}

function removePlayer(playerId) {
  if (waitingPlayer === playerId) {
    waitingPlayer = null;
  }
}

module.exports = {
  addPlayer,
  removePlayer,
  getRoom
}
