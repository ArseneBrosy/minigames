import { sendInput, setPoints, ctx } from "../games.js";
import { animateValueBackAndForth } from "../animations.js";

const GLASS_SPEED = 20;
const GLASS_ON_Y = 390;
const LIGHT_ANGLE = 30;
const LIGHT_SWING = 10;
const LIGHT_SWING_SPEED = 0.01;
const HAND_OFF = 520;
const HANDS_HEIGHT = 390;

const TABLE_SPRITE = new Image();
TABLE_SPRITE.src = './src/images/games/light-fingers/table.png';
const GLASS_SPRITE = new Image();
GLASS_SPRITE.src = './src/images/games/light-fingers/glass.png';
const LIGHT_SPRITE = new Image();
LIGHT_SPRITE.src = './src/images/games/light-fingers/light.png';
const LEFT_HAND_SPRITE = new Image();
LEFT_HAND_SPRITE.src = './src/images/games/light-fingers/left-hand.png';
const RIGHT_HAND_SPRITE = new Image();
RIGHT_HAND_SPRITE.src = './src/images/games/light-fingers/right-hand.png';

let buzzerOn = false;
let glassY = GLASS_ON_Y;
let glassDirection = 0;
let points = [0, 0];
let lightSwing = 0;
let leftHandX = -HAND_OFF;
let rightHandX = 1920 + HAND_OFF - RIGHT_HAND_SPRITE.width;

function gameEvent(name, value) {
  console.log('game event :', name, value);
  if (name === 'buzzer-on') {
    buzzerOn = true;
    glassDirection = -1;
  }
  if (name === 'player-point') {
    points[value]++;
    glassDirection = 1;
    buzzerOn = false;

    // animate hand
    if (value === 0) {
      const start = -HAND_OFF;
      const middle = 0;
      animateValueBackAndForth(start, middle, 200, 200, (v) => {
        leftHandX = v;
      });
    } else {
      const start = 1920 + HAND_OFF - RIGHT_HAND_SPRITE.width;
      const middle = 1920 - RIGHT_HAND_SPRITE.width;
      animateValueBackAndForth(start, middle, 200, 200, (v) => {
        rightHandX = v;
      });
    }
  }
}

function startGame() {
  buzzerOn = false;
  points = [0, 0];
}

function drawFrame() {
  ctx.fillStyle = buzzerOn ? "#1c1c2b" : "#9e603a";
  ctx.fillRect(0, 0, 1920, 1080);
  ctx.drawImage(TABLE_SPRITE, 1920 / 2 - TABLE_SPRITE.width / 2, 1080 - TABLE_SPRITE.height);
  ctx.drawImage(GLASS_SPRITE, 1920 / 2 - GLASS_SPRITE.width / 2, glassY);

  // left hand
  ctx.drawImage(LEFT_HAND_SPRITE, leftHandX, HANDS_HEIGHT);

  // left hand
  ctx.drawImage(RIGHT_HAND_SPRITE, rightHandX, HANDS_HEIGHT);

  // lights
  if (!buzzerOn) {
    const x1 = 1920 / 4;
    const x2 = 1920 / 4 * 3;
    const y = -100;
    const angle1 = -(LIGHT_ANGLE + Math.sin(lightSwing) * LIGHT_SWING) * (Math.PI / 180);
    const angle2 = (LIGHT_ANGLE + Math.cos(lightSwing) * LIGHT_SWING) * (Math.PI / 180);

    ctx.translate(x1, y);
    ctx.rotate(angle1);
    ctx.drawImage(LIGHT_SPRITE, -LIGHT_SPRITE.width / 2, 0);
    ctx.rotate(-angle1);
    ctx.translate(-x1, -y);

    ctx.translate(x2, y);
    ctx.rotate(angle2);
    ctx.drawImage(LIGHT_SPRITE, -LIGHT_SPRITE.width / 2, 0);
    ctx.rotate(-angle2);
    ctx.translate(-x2, -y);
  }

  // move glass
  glassY += glassDirection * GLASS_SPEED;
  if (glassY < -GLASS_SPRITE.height) {
    glassDirection = 0;
    glassY = -GLASS_SPRITE.height;
  }
  if (glassY > GLASS_ON_Y) {
    glassDirection = 0;
    glassY = GLASS_ON_Y;
  }

  // swing lights
  lightSwing += LIGHT_SWING_SPEED;
  if (lightSwing >= Math.PI * 2) {
    lightSwing = 0;
  }
  setPoints(points);
}

document.addEventListener('keydown', (e) => {
  if (e.key === ' ') {
    sendInput(null);
  }
});

export { gameEvent, startGame, drawFrame };