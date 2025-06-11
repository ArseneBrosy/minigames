const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const matchmaking = require('./matchmaking');
const games = require('./games');

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

const rooms = {};
/*
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

    // Initialize the room
    if (!rooms[roomName]) {
      rooms[roomName] = {
        createdAt: Date.now(),
        players: [],
        status: 'waiting',
        results: [0, 0, 0, 0, 0, 0, 0],
        game: null,
        gameState: {}
      };
    }

    // Add the player to the room's object
    rooms[roomName].players.push({
      id: socket.id
    });

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
      const master = io.sockets.sockets.get(rooms[roomName].players[0].id);
      master.emit('roomFull', { room: roomName, player: 1 });
      socket.emit('roomFull', { room: roomName, player: 2 });
      rooms[roomName].status = 'full';

      // reset for next public room
      if (!privateRoom) {
        waitingPlayer = null;
        publicRoomName = `public-${roomIdCounter++}`;
      }

      // start the game
      master.on('startGame', () => {
        const gameId = 0;
        io.to(roomName).emit('gameResult', { nextGameId: gameId, results: rooms[roomName].results });
        rooms[roomName].status = 'game-result';
        rooms[roomName].game = gameId;
        rooms[roomName].gameState = {};

        // start the game in 5 seconds
        setTimeout(() => {
          io.to(roomName).emit('nextGame');
          rooms[roomName].status = 'game';
        }, 5000);
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('Disconnected :', socket.id);
    if (socket === waitingPlayer) {
      waitingPlayer = null;
    }
  });
});
 */

io.on('connection', (socket) => {
  socket.on('playerConnected', (attributes) => {
    // find the player's room
    const room = matchmaking.addPlayer(socket.id, attributes);

    // add the player to it's room
    socket.join(room.name);

    // send the player a message if he is the first one
    if (room.status === 'waiting') {
      socket.emit('waiting');
    }

    // send players a message if the room is full
    if (room.status === 'full') {
      io.to(room.name).emit('roomFull', { room: room.name, master: room.players[0].id });
    }
  });

  /*
  socket.on('startGame', () => {
    const roomName = matchmaking.getPlayerRoom(socket.id);
    const nextGame =
    if (roomName) {
      io.to(roomName).emit('gameResult', { nextGameId: gameId, results: rooms[roomName].results });
    }
  });*/

  socket.on('disconnect', () => {
    matchmaking.removePlayer(socket.id);
  });
});

server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});
