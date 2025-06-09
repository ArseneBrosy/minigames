const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // TODO : change that
    methods: ["GET", "POST"]
  }
});

let waitingPlayer = null;
let roomIdCounter = 1;
let publicRoomName = `public-${roomIdCounter++}`;

io.on('connection', (socket) => {
  socket.on('playerConnected', (attributes) => {
    console.log('Player connected :', socket.id, attributes);

    // Find the player's room
    let roomName = publicRoomName;
    let privateRoom = attributes.roomId !== null;
    if (privateRoom) {
      roomName = `private-${attributes.roomId}`
    }

    // Add the player to the room
    const clients = io.sockets.adapter.rooms.get(roomName);
    socket.join(roomName);

    // check if it's the first player in it's room
    if (!clients) {
      if (!privateRoom) {
        waitingPlayer = socket;
      }
      socket.emit('waiting');
    } else {
      // Start the room
      console.log(`Room ${roomName} started`);

      // Notifiy both players
      const firstId = clients.values().next().value;
      io.sockets.sockets.get(firstId).emit('startGame', { room: roomName, player: 1 });
      socket.emit('startGame', { room: roomName, player: 2 });

      // reset for next public room
      if (!privateRoom) {
        waitingPlayer = null;
        publicRoomName = `public-${roomIdCounter++}`;
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('Disconnected :', socket.id);
    if (socket === waitingPlayer) {
      waitingPlayer = null;
    }
  });
});

server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});
