const socket = io("http://172.232.41.124:3000");
const params = new URLSearchParams(window.location.search);
let nextGameTimer = 5;
let nextGameTimerInterval = null;
let publicRoom = true;

socket.on('connect', () => {
  socket.emit('playerConnected', { roomId : params.has('room') ? params.get('room') : null });
});

socket.on('waiting', () => {
  openMenu('waiting-menu');
  console.log('waiting');
});

socket.on('roomFull', ({ room, master }) => {
  console.log(`roomFull. room : ${room}, master: ${master}`);

  // if it's a public room, hide the give up button and start the game automatically
  if (publicRoom) {
    document.querySelector('#giveup-button').style.display = 'none';
    setTimeout(() => {
      socket.emit('startGame');
    }, 3000);
  }
});

socket.on('gameResult', ({ nextGameId, results }) => {
  openMenu('game-result-menu', true);
  document.querySelector('#next-game-id').innerText = `next game id : ${nextGameId}`;

  // start the timer
  document.querySelector('#next-game-timer').innerText = nextGameTimer;
  nextGameTimerInterval = setInterval(() => {
    if (nextGameTimer > 0) {
    nextGameTimer--;
    }
    document.querySelector('#next-game-timer').innerText = nextGameTimer;
  }, 1000);
});

socket.on('nextGame', () => {
  openMenu('game-menu', true);

  // reset timer
  clearInterval(nextGameTimerInterval);
  nextGameTimer = 5;
});