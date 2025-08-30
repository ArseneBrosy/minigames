import { sendInput, setPoints, ctx } from "../games.js";
import { animateValue, animateValueBackAndForth } from "../animations.js";

//region CONSTANTS
const GLASS_SPEED = 20;
const GLASS_ON_Y = 390;
const LIGHT_ANGLE = 30;
const LIGHT_SWING = 10;
const LIGHT_SWING_SPEED = 0.01;
const HAND_OFF = 520;
const HANDS_HEIGHT = 390;
const HAND_TRAVEL_TIME = 200;
const DIAMOND_Y = 550;
//endregion

//region SPRITES
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
const DIAMOND_SPRITE = new Image();
DIAMOND_SPRITE.src = './src/images/games/light-fingers/diamond.png';
//endregion

//region GLOBAL VARIABLES
let buzzerOn = false;
let glassY = GLASS_ON_Y;
let glassDirection = 0;
let points = [0, 0];
let lightSwing = 0;
let leftHandX = -HAND_OFF;
let rightHandX = 1920 + HAND_OFF - RIGHT_HAND_SPRITE.width;
let isTaking = false;
let diamondX = 1920 / 2 - DIAMOND_SPRITE.width / 2;
let diamondTaken = false;
let diamondSize = 1;
//endregion

function gameEvent(name, value) {
  console.log('game event :', name, value);
  if (name === 'buzzer-on') {
    buzzerOn = true;
    glassDirection = -1;
  }
  if (name === 'player-point') {
    points[value]++;

    // animate hand
    const start = (value === 0) ? -HAND_OFF : 1920 + HAND_OFF - RIGHT_HAND_SPRITE.width;
    const middle = (value === 0) ? 0 : 1920 - RIGHT_HAND_SPRITE.width;
    const diamondCenter = 1920 / 2 - DIAMOND_SPRITE.width / 2;
    const diamondDirection = (value === 0) ? -1 : 1;
    animateHand(start, middle, HAND_TRAVEL_TIME, HAND_TRAVEL_TIME, value);

    // diamond taken
    setTimeout(() => {
      diamondTaken = true;
      diamondSize = 0;
      animateValue(diamondCenter,  diamondCenter+ HAND_OFF * diamondDirection, HAND_TRAVEL_TIME, (v) => {
        diamondX = v;
      }, () => {
        diamondTaken = false;

        // reset buzzer
        glassDirection = 1;
        buzzerOn = false;

        // new diamond
        setTimeout(() => {
          animateValue(0, 1, 300, (v) => {
            diamondSize = v;
          });
        }, 200);
      });
    }, HAND_TRAVEL_TIME);
  }
  if (name === 'player-failed') {
    isTaking = false;
    const start = (value.player === 0) ? -HAND_OFF : 1920 + HAND_OFF - RIGHT_HAND_SPRITE.width;
    const middle = (value.player === 0) ? 0 : 1920 - RIGHT_HAND_SPRITE.width;
    animateHand(start, middle, HAND_TRAVEL_TIME, value.time - HAND_TRAVEL_TIME, value.player);
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

  // diamond
  if (diamondTaken) {
    ctx.drawImage(DIAMOND_SPRITE, diamondX, DIAMOND_Y);
  }
  if (diamondSize > 0) {
    const centerDiamondX = 1920 / 2 - (DIAMOND_SPRITE.width * diamondSize) / 2;
    const centerDiamondY = DIAMOND_Y + (DIAMOND_SPRITE.height * (1 - diamondSize)) / 2;
    ctx.drawImage(DIAMOND_SPRITE, centerDiamondX, centerDiamondY, DIAMOND_SPRITE.width * diamondSize, DIAMOND_SPRITE.height * diamondSize);
  }

  ctx.drawImage(GLASS_SPRITE, 1920 / 2 - GLASS_SPRITE.width / 2, glassY);
  ctx.drawImage(LEFT_HAND_SPRITE, leftHandX, HANDS_HEIGHT);
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

function animateHand(start, middle, forward, backward, player) {
  animateValueBackAndForth(start, middle, forward, backward, (v) => {
    if (player === 0) {
      leftHandX = v;
    } else {
      rightHandX = v;
    }
  }, () => {
    isTaking = false;
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === ' ' && !isTaking) {
    sendInput(null);
    isTaking = true;
  }
});

export { gameEvent, startGame, drawFrame };