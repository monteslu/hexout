import { box2d, utils, keys } from 'frozenjs';

import boxData from './boxData';
import draw from './draw';
import update from './update';
import Ball from './Ball';
import rawBricks from './bricks';
import colors from './colors';
import Brick from './Brick';
import Face from './Face';
import handleInput from './handleInput';

const { BoxGame, entities, joints } = box2d;
const { rotateRadiansAroundCenter, distance } = utils;

console.log('update', update);

// Full HD Game !
const fullW = 1920;
const fullH = 1080;
const hexSide = 783.79773844413;
const sideW = 568.10113077769;
const sint1 = 540 / hexSide;
const ang1 = Math.asin(sint1);
const sint2 = sideW / hexSide;
const ang2 = Math.asin(sint2)
console.log('angle in radians', ang1, ang2);
const centerPoint = {x: 0, y: 0};


//setup a GameCore instance
const game = new BoxGame({
  canvasId: 'canvas',
  gameAreaId: 'gameArea',
  canvasPercentage: 1,
  boxOptions: {resolveCollisions: true, gravityY: 0},
  draw,
  update,
  loadResources: function(rm) {
    this.explosions = [];
    this.explosions.push(rm.loadSound('sounds/explosion5'));
    this.explosions.push(rm.loadSound('sounds/explosion7'));
    this.explosions.push(rm.loadSound('sounds/explosion8'));
    this.scream = rm.loadSound('sounds/scream');
    this.paddleSound = rm.loadSound('sounds/paddle');
  },
  initInput: function(im){
    im.addArrowKeyActions();
    im.addKeyAction(['A','D', 
      'Q','W','E',
      'X','C','V',
      'B','N','M',
      'T','Y','U',
      'O','P', keys.OPEN_BRACKET,
      keys.SLASH]);
  },
  handleInput,
  getBricksLeft: function() {
    return Object.keys(this.entities).reduce((acc, k) => {
      if(this.entities[k].brick) {
          return acc + 1;
        }
      return acc;
    }, 0);
  },
  distFromAnchor: 295,
  ballSpeed: 400,
});

const ballProps = {
  x: fullW / 2,
  y: fullH / 2,
  ptRadius: 10,
  radius: 10,
  points: [0,1,2,3,4,5,6,7,8],
  id: 'ball',
  wallHits: 0,
  hidden: true
};

ballProps.points = ballProps.points.map((p, idx) => {
  const newPt = rotateRadiansAroundCenter(centerPoint, {x: 0, y: ballProps.ptRadius}, ((Math.PI * 2) / ballProps.points.length) * idx);
  return newPt
});

game.ball = new Ball(ballProps);
game.addBody(game.ball);

  //add everything to box from the boxData
boxData.entities.forEach(function(props){
  const Entity = entities[props.type];
  if(Entity){
    props.drawCenter = false;
    game.addBody(new Entity(props));
  }
});


const pct = 0.6043122389547918583; 

const angs = [
  0,
  ang1,
  ang2 + (Math.PI/2),
  Math.PI,
  Math.PI + ang1,
  (Math.PI * 1.5) + ang2
];

let c = [
  [fullW / 2, 0],
  [fullW - (sideW * pct), (fullH / 2) * (1 - pct)],
  [fullW - (sideW * pct), (fullH / 2) + ((fullH / 2) * pct)],
  [fullW / 2, fullH],
  [sideW * pct, (fullH / 2) + ((fullH / 2) * pct)],
  [sideW * pct, (fullH / 2) * (1 - pct)],
];

const players = c.map((cpt, idx) => {
  return {
    pt: {x: cpt[0], y: cpt[1]},
    color: colors.rgb(idx),
    colorComplement: colors.complement(idx),
    angle: angs[idx],
    direction: 0,
    position: Math.PI / 2,
    update: 0
  }
});

console.log('players', players);

const origin = players[0].pt;

players.forEach((p, idx) => {
  console.log('creating player', p);
  const ppt = p.pt;

  const newFacePt = rotateRadiansAroundCenter(ppt, {x: ppt.x, y: ppt.y + 55}, p.angle);
  const cir = new Face({
    x: newFacePt.x,
    y: newFacePt.y,
    radius: 50,
    staticBody: true,
    restitution: 2,
    fillStyle: p.color,
    deadFillStyle: colors.rgba(idx, 0.25),
    king: true,
    ball: game.ball,
    playerId: idx,
  });
  game.addBody(cir);
  p.face = cir;

  const newPaddlePt = rotateRadiansAroundCenter(ppt, {x: ppt.x, y: ppt.y + game.distFromAnchor}, p.angle);
  p.paddleOps = {
    x: newPaddlePt.x,
    y: newPaddlePt.y,
    halfWidth: 55,
    halfHeight: 12,
    restitution: 1,
    fillStyle: p.color,
    strokeStyle: p.color,
    paddle: true,
    drawCenter: false,
    playerId: idx,
    density: 100,
    staticBody: true,
    id: idx + 'paddle0',
    hidden: true,
    drawLocation: false,
  };
  p.paddleOps.points = [
    {x: p.paddleOps.halfWidth, y: -p.paddleOps.halfHeight},
    {x: p.paddleOps.halfWidth, y: p.paddleOps.halfHeight},
    {x: -p.paddleOps.halfWidth, y: p.paddleOps.halfHeight},
    {x: -p.paddleOps.halfWidth, y: -p.paddleOps.halfHeight},
  ];

  p.paddleOps.points = p.paddleOps.points.map((oppt) => {
    return rotateRadiansAroundCenter(centerPoint, oppt, p.angle);
  });
  const paddle = new entities.Polygon(p.paddleOps);
  game.addBody(paddle);
  p.paddles = [paddle];

  p.anchor = new entities.Circle({
    x: p.pt.x,
    y: p.pt.y,
    radius: 0.1,
    staticBody: true,
    playerId: idx,
    hidden: true
  });
  game.addBody(p.anchor);

  paddle.distance = distance(p.anchor, paddle);

  const cJoint = new joints.Distance({bodyId1: p.anchor.id, bodyId2: paddle.id, id: Math.random() + 'j'});
  game.addJoint(cJoint);

  rawBricks.forEach((rb, jdx) => {
    const ops = {
      x: rb[0] + (fullW / 2),
      y: rb[1],
      halfWidth: 25,
      halfHeight: 12.5,
      staticBody: true,
      restitution: 1.5,
      playerId: idx,
      fillStyle: p.color,
      brick: true,
      preAngle: p.angle,
    };
  
    const pt = rotateRadiansAroundCenter(origin, ops, p.angle);
    
    ops.x = pt.x;
    ops.y = pt.y;
  
  
    ops.x += (ppt.x - players[0].pt.x);
    ops.y += (ppt.y - players[0].pt.y);

    ops.points = [
      {x: ops.halfWidth, y: -ops.halfHeight},
      {x: ops.halfWidth, y: ops.halfHeight},
      {x: -ops.halfWidth, y: ops.halfHeight},
      {x: -ops.halfWidth, y: -ops.halfHeight},
    ];

    ops.points = ops.points.map((oppt) => {
      return rotateRadiansAroundCenter(centerPoint, oppt, p.angle);
    });

    ops.prex = ops.x;
    ops.prey = ops.y;
  
    const b = new Brick(ops);
    game.addBody(b);

  });

});

game.measurements = {fullW, fullH, hexSide, sideW, sint1, ang1, sint2, ang2};
game.players = players;

//if you want to take a look at the game object in dev tools
console.log(game);
window.game = game;

//launch the game!
game.run();
game.box.applyForceDegrees('ball', Math.random() * 360, game.ballSpeed);
