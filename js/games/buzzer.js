import {sendInput} from "../games.js";

function gameEvent(name, value) {
  console.log('game event :', name, value);
}

document.addEventListener('keydown', (e) => {
  if (e.key === ' ') {
    sendInput(null);
  }
});

export { gameEvent };