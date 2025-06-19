const socket = io("http://172.232.41.124:3000");

socket.on('connect', () => {
  socket.emit('playerConnected', {
    private : !publicRoom,
    roomId : params.has('room') ? params.get('room') : null,
    pseudo : localStorage.getItem('pseudo'),
    picture : localStorage.getItem('picture'),
  });

  // Set my pseudo
  document.querySelector(`#${publicRoom ? '' : 'private-'}waiting-menu .pseudo`).innerText = localStorage.getItem('pseudo');
  document.querySelector(`#${publicRoom ? '' : 'private-'}waiting-menu .profile-picture`).style = `background: url("../src/images/profile${localStorage.getItem('picture')}.png")`;
});

socket.on('waiting', ({ roomId }) => {
  showWaitingMenu(roomId);
});

socket.on('roomFull', ({ players }) => {
  showFullMenu(players);
});

socket.on('gameResult', ({ nextGameId, results }) => {
  showGameResults(results, nextGameId);
});

socket.on('game-event', ({ name, value }) => {
  gameEvent(name, value);
});

socket.on('nextGame', () => {
  startNextGame();
});