import { box2d, keys, utils } from 'frozenjs';

import boxData from './boxData';
import draw from './draw';
import Head from './Head';
import rawBricks from './bricks';
import colors from './colors';

const { BoxGame, entities } = box2d;
const { Revolute } = box2d.joints;
const { radiansFromCenter, scalePoints, rotateRadiansAroundCenter } = utils;

const speed = 10;

// Full HD Game !
const fullW = 1920;
const fullH = 1080;

//setup a GameCore instance
const game = new BoxGame({
  canvasId: 'canvas',
  gameAreaId: 'gameArea',
  canvasPercentage: 0.95,
  boxOptions: {resolveCollisions: true},
  draw: draw,
  initInput: function(im){
    im.addArrowKeyActions();

    im.addKeyAction('A');
    im.addKeyAction('D');
  },
  handleInput: function(im){
    if(im.keyActions[keys.LEFT].isPressed()){
      this.box.applyImpulseDegrees('head', 270, speed);
    }

    if(im.keyActions[keys.RIGHT].isPressed()){
      this.box.applyImpulseDegrees('head', 90, speed);
    }

    if(im.keyActions[keys.UP].isPressed()){
      this.box.applyImpulseDegrees('head', 0, speed);
    }

    if(im.keyActions[keys.DOWN].isPressed()){
      this.box.applyImpulseDegrees('head', 180, speed);
    }

    if(im.keyActions.A.isPressed()){
      this.box.applyTorque('head', -speed * 100);
    }

    if(im.keyActions.D.isPressed()){
      this.box.applyTorque('head', speed  * 100);
    }

    if(im.mouseAction.isPressed()){
      this.box.applyImpulse('head', radiansFromCenter(this.entities.torso, scalePoints(im.mouseAction.position, 1/this.box.scale)), speed);
    }
  },
  update: function(millis) {
    this.updateBox(millis);
    if(this.head && this.head.collisions) {
      //console.log('head', this.head.collisions);
      this.head.collisions.forEach((et) => {
        const ent = this.entities[et.id];
        if(ent && ent.brick) {
          this.removeBody(et);
        }
        else if ( ent && ent.king) {
          ent.fillStyle = 'black';
        }
      })
    }
    if(this.entities.neck && this.entities.neck.collisions) {
      //console.log('entities.neck', this.entities.neck.collisions);
      this.entities.neck.collisions.forEach((et) => {
        const ent = this.entities[et.id];
        if(ent && ent.brick) {
          this.removeBody(et);
        }
        else if ( ent && ent.king) {
          ent.fillStyle = 'black';
        }
      })
    }
  }
});



  //add everything to box from the boxData
boxData.entities.forEach(function(props){
  if(props.id === 'head'){
    props.img = game.resourceManager.loadImage('images/head.png');
    game.head = new Head(props);
    game.addBody(game.head);
  } else {
    const Entity = entities[props.type];
    if(Entity){
      props.drawCenter = false;
      game.addBody(new Entity(props));
    }
  }
});


const hexSide = 783.79773844413;
const sideW = 568.10113077769;

//const ang = Math.atan( Math.tan(540,sideW, 540));
const sint1 = 540 / hexSide;
const ang1 = Math.asin(sint1);
const sint2 = sideW / hexSide;
const ang2 = Math.asin(sint2)
console.log('angle in radians', ang1, ang2);

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
    pt: cpt,
    color: colors[idx],
    angle: angs[idx]
  }
});

console.log('players', players);

const d1 = Math.sqrt(
  Math.pow((c[1][0] - c[0][0]), 2) 
  + Math.pow((c[1][1] - c[0][1]), 2) 
);

const d2 = Math.sqrt(
  Math.pow((c[5][0] - c[0][0]), 2) 
  + Math.pow((c[5][1] - c[0][1]), 2) 
)

console.log('d', d1, d2, d1 - d2, c );

const origin = {x: players[0].pt[0], y: players[0].pt[1]};

players.forEach((p, idx) => {
  console.log('creating player', p);
  const ppt = {x: p.pt[0], y: p.pt[1]};
  const newHeadPt = rotateRadiansAroundCenter(ppt, {x: ppt.x, y: ppt.y + 55}, p.angle);
  const cir = new entities.Circle({
    x: newHeadPt.x,
    y: newHeadPt.y,
    radius: 50,
    staticBody: true,
    restitution: 2,
    fillStyle: p.color,
    king: true
  });
  game.addBody(cir);

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
      brick: true
    };
  
    const pt = rotateRadiansAroundCenter(origin, ops, p.angle);
    console.log('rotated pt', pt);
  
    ops.x = pt.x;
    ops.y = pt.y;
  
  
    ops.x += (ppt.x - players[0].pt[0]);
    ops.y += (ppt.y - players[0].pt[1]);

    ops.points = [
      {x: ops.halfWidth, y: -ops.halfHeight},
      {x: ops.halfWidth, y: ops.halfHeight},
      {x: -ops.halfWidth, y: ops.halfHeight},
      {x: -ops.halfWidth, y: -ops.halfHeight},
    ];

    ops.points = ops.points.map((oppt) => {
      return rotateRadiansAroundCenter({x: 0, y: 0}, oppt, p.angle);
    })
  
    const b = new entities.Polygon(ops);
    //console.log(b);
    // setTimeout(() => {
      game.addBody(b);
      // console.log('wtf timeout', b);
    // }, 10 + (idx * 10) + jdx);

  });

});



boxData.joints.forEach(function(props){
  var joint;
  if(props.type === 'Revolute'){
    joint = new Revolute(props);
  }

  if(joint){
    game.box.addJoint(joint);
  }
});

//if you want to take a look at the game object in dev tools
console.log(game);
window.game = game;


//launch the game!
game.run();
game.box.applyImpulseDegrees('head', Math.random() * 360, 50);
