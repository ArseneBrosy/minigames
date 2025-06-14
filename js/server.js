const params = new URLSearchParams(window.location.search);
let nextGameTimer = 5;
let nextGameTimerInterval = null;
const publicRoom = !(params.has('room') || params.has('private'));
let master = false;

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
  if (!publicRoom) {
    document.querySelector('#private-code').innerText = roomId;
    document.querySelector('#private-link').value = window.location.href.split('?')[0] + `?room=${roomId}`;
    document.querySelector('#start-game-button').style.display = 'unset';
    document.querySelector('#invite').style.display = 'unset';
  }
  openMenu(`${publicRoom ? '' : 'private-'}waiting-menu`);
  master = true;
});

socket.on('roomFull', ({ room, players }) => {
  console.log(`roomFull. room : ${room}`);
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

  // show the opponent
  const opponentCard = document.querySelector(`#${publicRoom ? '' : 'private-'}waiting-menu .nobody`);
  opponentCard.classList.remove('nobody');
  opponentCard.innerHTML = `
    <div class="profile-picture" style="background: url('../src/images/profile${players[master ? 1 : 0].picture}.png')"></div>
    <div class="pseudo">${players[master ? 1 : 0].pseudo}</div>
  `;
});

socket.on('gameResult', ({ nextGameId, results }) => {
  // set the results
  let resultsHTML = '';
  for (result of results) {
    resultsHTML += `<div class="res${result}"></div>`
  }
  document.querySelector('.result-bar').innerHTML = resultsHTML;

  // start the timer
  document.querySelector('#next-game-timer').innerText = nextGameTimer;
  nextGameTimerInterval = setInterval(() => {
    if (nextGameTimer > 0) {
    nextGameTimer--;
    }
    document.querySelector('#next-game-timer').innerText = nextGameTimer;
  }, 1000);

  openMenu('game-result-menu', true);
});

socket.on('game-event', ({ name, value }) => {
  console.log('game event :', name, value);
});

socket.on('nextGame', () => {
  openMenu('game-menu', true);

  // reset timer
  clearInterval(nextGameTimerInterval);
  nextGameTimer = 5;
});