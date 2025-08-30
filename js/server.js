const socket = io("http://172.232.41.124:3000");
import * as lobby from "./lobby.js";
import * as games from "./games.js";

socket.on('connect', () => {
  const attributes = lobby.connectPlayer();
  socket.emit('playerConnected', attributes);
});

socket.on('waiting', ({ roomId }) => {
  lobby.showWaitingMenu(roomId);
});

socket.on('roomFull', ({ players }) => {
  const publicRoom = lobby.showFullMenu(players);

  // if it's a public room, start the game automatically
  if (publicRoom) {
    setTimeout(() => {
      socket.emit('startGame');
    }, 3000);
  }
});

socket.on('gameResult', ({ nextGameId, results, winner, gameIndex }) => {
  if (gameIndex > 0) {
    games.endGame(winner, results);
  }
  if (gameIndex < results.length) {
    setTimeout(() => {
      games.showGameResults(nextGameId);
    }, gameIndex > 0 ? 2000 : 0);
  }
});

socket.on('game-event', ({ name, value }) => {
  games.gameEvent(name, value);
});

socket.on('nextGame', () => {
  games.startNextGame();
});

socket.on('end-party', ({ winner, winnerPseudo, looserPseudo, winnerPicture, looserPicture }) => {
  games.endParty(winner, { profile: winnerPicture, pseudo : winnerPseudo }, { profile: looserPicture, pseudo : looserPseudo });
});

document.addEventListener('player-input', (e) => {
  socket.emit('input', e.detail);
});