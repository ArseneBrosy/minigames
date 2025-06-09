const socket = io("http://172.232.41.124:3000");
const params = new URLSearchParams(window.location.search);
let nextGameTimer = 5;
let nextGameTimerInterval = null;

socket.on('connect', () => {
  socket.emit('playerConnected', { roomId : params.has('room') ? params.get('room') : null });
});

socket.on('waiting', () => {
  document.getElementById('status').innerText = 'En attente d\'un adversaire';
});

socket.on('roomFull', ({ room, player }) => {
  document.getElementById('status').innerText = `Jeu démarré dans la room "${room}" en tant que Joueur ${player}`;
  if (player === 1) {
    document.querySelector('#start-button').style.display = 'unset';
  }
});

socket.on('gameResult', ({ nextGameId, results }) => {
  document.querySelector('#lobby').style.display = 'none';
  document.querySelector('#game-result').style.display = 'unset';
  document.querySelector('#game').style.display = 'none';
  document.querySelector('#next-game-id').innerText = `next game id : ${nextGameId}`;

  // start the timer
  document.querySelector('#next-game-timer').innerText = nextGameTimer;
  nextGameTimerInterval = setInterval(() => {
    nextGameTimer--;
    document.querySelector('#next-game-timer').innerText = nextGameTimer;
  }, 1000);
});

socket.on('nextGame', () => {
  document.querySelector('#game-result').style.display = 'none';
  document.querySelector('#game').style.display = 'unset';

  // reset timer
  clearInterval(nextGameTimerInterval);
  nextGameTimer = 5;
});