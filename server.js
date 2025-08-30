const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const matchmaking = require('./matchmaking');
const games = require('./games');
const eventBus = require('./eventBus');

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
      const roomId = attributes.private ? room.name.slice(-5) : null;
      socket.emit('waiting', { roomId : roomId });
    }

    // send players a message if the room is full
    if (room.status === 'full') {
      io.to(room.name).emit('roomFull', { players: room.players });
    }
  });

  socket.on('startGame', () => {
    // find the player's room
    const roomName = matchmaking.getPlayerRoom(socket.id);
    if (roomName) {
      let room = matchmaking.getRoom(roomName);

      // check that the room is full and that the master requested
      if (room.status === 'full' && room.players[0].id === socket.id) {
        room = games.setNextGame(roomName);

        io.to(roomName).emit('gameResult', {nextGameId: room.game, results: room.results, winner: null, gameIndex: room.gameIndex});

        // start the game in 5 seconds
        setTimeout(() => {
          io.to(roomName).emit('nextGame');
          games.launchGame(roomName);
        }, 5000);
      }
    }

    socket.on('input', (input) => {
      // find the player's room
      const roomName = matchmaking.getPlayerRoom(socket.id);
      if (roomName) {
        let room = matchmaking.getRoom(roomName);

        // check that the room is in game
        if (room.status === 'game') {
          const playerIndex = room.players.findIndex(player => player.id === socket.id);
          games.applyInput(roomName, playerIndex, input);
        }
      }
    });
  });

  socket.on('disconnect', () => {
    matchmaking.removePlayer(socket.id);
  });
});

eventBus.on('game-event', (content) => {
  io.to(content.room).emit('game-event', { name : content.name, value : content.value});
});

eventBus.on('game-end', (content) => {
  const room = games.setNextGame(content.room);

  // set the result
  room.results[room.gameIndex] = content.winner + 1;
  room.gameIndex++;

  // find the winner name
  const winner = room.players[content.winner].pseudo;

  io.to(content.room).emit('gameResult', {nextGameId: room.game, results: room.results, winner: { id: content.winner, pseudo: winner }, gameIndex: room.gameIndex});

  if (room.gameIndex >= room.results.length) {
    // find the party winner
    let winner = 0;
    for (let result of room.results) {
      winner += result === 1 ? -1 : 1;
    }
    winner = winner < 0 ? 0 : 1;

    const winnerPseudo = room.players[winner].pseudo;
    const looserPseudo = room.players[1 - winner].pseudo;
    const winnerPicture = room.players[winner].picture;
    const looserPicture = room.players[1 - winner].picture;

    io.to(content.room).emit('end-party', { winner: winner, winnerPseudo: winnerPseudo, looserPseudo: looserPseudo, winnerPicture: winnerPicture, looserPicture: looserPicture });
  } else {
    // start the game in 5 seconds
    setTimeout(() => {
      io.to(content.room).emit('nextGame');
      games.launchGame(content.room);
    }, 7000);
  }
});

server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});
