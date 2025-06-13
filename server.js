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

io.on('connection', (socket) => {
  socket.on('playerConnected', (attributes) => {
    console.log('Player connected :', socket.id, attributes);

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


  socket.on('startGame', () => {
    // find the player's room
    const roomName = matchmaking.getPlayerRoom(socket.id);
    if (roomName) {
      const room = games.setNextGame(roomName);
      io.to(roomName).emit('gameResult', { nextGameId: room.game, results: room.results });

      // start the game in 5 seconds
      setTimeout(() => {
        io.to(roomName).emit('nextGame');
        room.status = 'game';
      }, 5000);
    }
  });

  socket.on('disconnect', () => {
    matchmaking.removePlayer(socket.id);
  });
});

server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});
