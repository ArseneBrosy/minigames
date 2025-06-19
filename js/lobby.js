const params = new URLSearchParams(window.location.search);
const publicRoom = !(params.has('room') || params.has('private'));

//region HTML Objects
const pseudoText = document.querySelector(`#${publicRoom ? '' : 'private-'}waiting-menu .pseudo`);
const profilePicture = document.querySelector(`#${publicRoom ? '' : 'private-'}waiting-menu .profile-picture`);
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
 * connect a player to the server
 * @returns {{private: boolean, pseudo: string, roomId: (string|null), picture: string}} the player's attributes
 */
function connectPlayer() {
  // Set my pseudo
  pseudoText.innerText = localStorage.getItem('pseudo');
  profilePicture.style = `background: url("../src/images/profile${localStorage.getItem('picture')}.png")`;

  // return the player's attributes
  return {
    private : !publicRoom,
    roomId : params.has('room') ? params.get('room') : null,
    pseudo : localStorage.getItem('pseudo'),
    picture : localStorage.getItem('picture'),
  };
}

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
 * @returns {boolean} true if the room is a public room
 */
function showFullMenu(players) {
  openMenu(`${publicRoom ? '' : 'private-'}waiting-menu`);

  // if it's a public room, hide the give up button
  if (publicRoom) {
    giveUpButton.style.display = 'none';
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

  return publicRoom;
}

export { connectPlayer, showWaitingMenu, showFullMenu };