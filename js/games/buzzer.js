import { sendInput, setPoints, ctx } from "../games.js";

const RED_LIGHT_SPRITE = new Image();
RED_LIGHT_SPRITE.src = './src/images/games/buzzer/red-light.png';
const GREEN_LIGHT_SPRITE = new Image();
GREEN_LIGHT_SPRITE.src = './src/images/games/buzzer/green-light.png';

let buzzerOn = false;
let points = [0, 0];

function gameEvent(name, value) {
  console.log('game event :', name, value);
  if (name === 'buzzer-on') {
    buzzerOn = true;
  }
  if (name === 'player-point') {
    buzzerOn = false;
    points[value]++;
  }
  drawFrame();
}

function startGame() {
  buzzerOn = false;
  points = [0, 0];
  drawFrame();
}

function drawFrame() {
  ctx.fillStyle = "#535353";
  ctx.fillRect(0, 0, 1920, 1080);
  const lightSprite = buzzerOn ? GREEN_LIGHT_SPRITE : RED_LIGHT_SPRITE;
  ctx.drawImage(lightSprite, 1920 / 2 - lightSprite.width / 2, 1080 - lightSprite.height);
  setPoints(points);
}

document.addEventListener('keydown', (e) => {
  if (e.key === ' ') {
    sendInput(null);
  }
});

export { gameEvent, startGame };