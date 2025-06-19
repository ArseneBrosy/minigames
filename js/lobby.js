const params = new URLSearchParams(window.location.search);
const publicRoom = !(params.has('room') || params.has('private'));

//region HTML Objects
const privateCodeText = document.querySelector('#private-code');
const privateLinkText = document.querySelector('#private-link');
const startGameButton = document.querySelector('#start-game-button');
const inviteButton = document.querySelector('#invite');
const giveUpButton = document.querySelector('#giveup-button');
//endregion

//region variables
let master = false;
//endregion

/**
 * Show the waiting for opponent menu
 * @param roomId the room ID in case it's a private room
 */
function showWaitingMenu(roomId) {
  if (!publicRoom) {
    privateCodeText.innerText = roomId;
    privateLinkText.value = window.location.href.split('?')[0] + `?room=${roomId}`;
    startGameButton.style.display = 'unset';
    inviteButton.style.display = 'unset';
  }
  openMenu(`${publicRoom ? '' : 'private-'}waiting-menu`);
  master = true;
}

/**
 * Show the full room menu
 * @param players the players in the room
 */
function showFullMenu(players) {
  openMenu(`${publicRoom ? '' : 'private-'}waiting-menu`);

  // if it's a public room, hide the give up button and start the game automatically
  if (publicRoom) {
    giveUpButton.style.display = 'none';
    setTimeout(() => {
      socket.emit('startGame');
    }, 3000);
  }

  // if it's a private room enable the start game button for the master
  else {
    startGameButton.classList.remove('off');
  }

  // show the opponent
  const opponentCard = document.querySelector(`#${publicRoom ? '' : 'private-'}waiting-menu .nobody`);
  opponentCard.classList.remove('nobody');
  opponentCard.innerHTML = `
    <div class="profile-picture" style="background: url('../src/images/profile${players[master ? 1 : 0].picture}.png')"></div>
    <div class="pseudo">${players[master ? 1 : 0].pseudo}</div>
  `;
}