const params = new URLSearchParams(window.location.search);
let nextGameTimer = 5;
let nextGameTimerInterval = null;
const publicRoom = !(params.has('room') || params.has('private'));

const socket = io("http://172.232.41.124:3000");

socket.on('connect', () => {
  socket.emit('playerConnected', { private : !publicRoom, roomId : params.has('room') ? params.get('room') : null });
});

socket.on('waiting', ({ roomId }) => {
  if (!publicRoom) {
    document.querySelector('#private-code').innerText = roomId;
    document.querySelector('#private-link').value = window.location.href.split('?')[0] + `?room=${roomId}`;
    document.querySelector('#start-game-button').style.display = 'unset';
    document.querySelector('#invite').style.display = 'unset';
  }
  openMenu(`${publicRoom ? '' : 'private-'}waiting-menu`);
});

socket.on('roomFull', ({ room, master }) => {
  console.log(`roomFull. room : ${room}, master: ${master}`);
  openMenu(`${publicRoom ? '' : 'private-'}waiting-menu`);

  // if it's a public room, hide the give up button and start the game automatically
  if (publicRoom) {
    document.querySelector('#giveup-button').style.display = 'none';
    setTimeout(() => {
      socket.emit('startGame');
    }, 3000);
  }

  // if it's a private room enable the start game button for the master
  else {
    document.querySelector('#start-game-button').classList.remove('off');
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