import { box2d, utils, keys } from 'frozenjs';

import boxData from './boxData';
import draw from './draw';
import Ball from './Ball';
import rawBricks from './bricks';
import colors from './colors';
import Brick from './Brick';
import Face from './Face';
import handleInput from './handleInput';

const { BoxGame, entities, joints } = box2d;
const { radiansFromCenter, scalePoints, rotateRadiansAroundCenter, distance, radiansToDegrees } = utils;

const playerSpeed = 0.0027;
const distFromAnchor = 295;
const ballSpeed = 400;
const randomAngleSpread = ((Math.PI * 2) / 360) * 1.75;
const BRICK_DEATH_ANIM = 2500;

function getRandomAngleOffset() {
  return Math.round(Math.random()) ? -(Math.random() * randomAngleSpread) : Math.random() * randomAngleSpread;
}

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
  draw: draw,
  loadResources: function(rm) {
    this.explosions = [];
    this.explosions.push(rm.loadSound('sounds/explosion5'));
    this.explosions.push(rm.loadSound('sounds/explosion7'));
    this.explosions.push(rm.loadSound('sounds/explosion8'));
    this.scream = rm.loadSound('sounds/scream');
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
  update: function(millis) {
    this.updateBox(millis);

    Object.keys(this.entities).forEach((k) => {
      const ent = this.entities[k];
      if(ent.brickPiece) {
        ent.life = ent.life - millis;
        if(ent.life < 0) {
          this.removeBody(ent);
        } else {
          ent.fillStyle = colors.rgba(ent.playerId, ent.life / BRICK_DEATH_ANIM * 0.6);
        }
      }
    })

    if(this.ball) {
      
      if(this.ball.collisions && this.ball.collisions.length) {
        //console.log('ball', this.ball.collisions);
        this.ball.collisions.forEach((et) => {
          const ent = this.entities[et.id];
          if(ent) {
            if(ent.brick) {
              this.removeBody(et);
              //
              console.log('brick kill', ent);
              const lilOps = {
                x: ent.x * 30,
                y: ent.y * 30,
                brickPiece: true,
                life: BRICK_DEATH_ANIM,
                staticBody: false,
                density: 0.001,
                playerId: ent.playerId,
                fillStyle: colors.rgb(ent.playerId),
                drawCenter: false,
                drawLocation: false
              };
              [0,1,2,3,4,5].forEach((b) => {
                const lilbOps = {
                  halfHeight: ent.halfHeight / ((Math.random() * 2) + 2.5),
                  halfWidth: ent.halfWidth / ((Math.random() * 2) + 2.5),
                };
                const lilB = new entities.Rectangle(Object.assign({}, lilOps, lilbOps));
                this.addBody(lilB);
                this.box.setAngle(lilB.id, Math.random() * (Math.PI * 2));
                this.box.applyImpulse(lilB.id, Math.random() * (Math.PI * 2), 30);
              });
              const randExplosion = this.explosions[Math.floor(Math.random() * this.explosions.length)];
              randExplosion.play();
            }
            else if (ent.king) {
              console.log('king kill', ent);
              this.scream.play();
              ent.dead = true;

              Object.keys(this.entities).forEach((k) => {
                const brick = this.entities[k];
                if(brick.brick && brick.playerId === ent.playerId) {
                  this.removeBody(brick);
                }
              })

              this.players[ent.playerId].paddles.forEach((pad) => {
                this.removeBody(pad);
              });

              this.removeBody(ent); //remove face, but will still draw it

              
            } else if (ent.paddle) {
              
              const p = this.players[ent.playerId];
              
              const ballfromAnchor = distance(p.anchor, this.ball);
              const paddleFromAnchor = distance(p.anchor, ent);

              //ignore hits to bottom of paddle
              if(ballfromAnchor > paddleFromAnchor) {
                this.ball.hitPlayer = p;
                this.ball.hitPaddle = ent;
                if(p.firePressed) {
                  this.ball.caught = true;
                  this.ball.caughtPaddlePosition = p.position;
                  this.ball.caughtPlayerId = ent.playerId;
                  this.ball.caughtPosition = {x: this.ball.x, y: this.ball.y};
                }
              }
              //console.log('%c Oh my heavens! ', 'background: #222; color: #bada55');
              console.log('%cpaddlehit ' + ent.playerId, 'font-size: 1.5em; background: #222; color: ' + players[ent.playerId].color);


            }
            
            if (ent.wall) {
              this.ball.wallHits++;
            } else {
              this.ball.wallHits = 0;
            }
          }
          
        });
        

        function fireBall(){

        }

        this.removeBody(this.ball);
        this.ball.angularVelocity = null;
        this.ball.prevLinearVelocity = this.ball.linearVelocity;
        this.ball.linearVelocity = null;
        if(this.ball.caught) {
          const caughtPlayer = this.players[this.ball.caughtPlayerId];
          const positionDelta = caughtPlayer.position - this.ball.caughtPaddlePosition + (Math.PI * 2);
          const newBallLoc = rotateRadiansAroundCenter(caughtPlayer.anchor, this.ball.caughtPosition, positionDelta);
          console.log('caught', positionDelta, newBallLoc);
          
          this.ball.x = newBallLoc.x;
          this.ball.y = newBallLoc.y;
          if(caughtPlayer.firePressed) {
            //still caught
          } else {
            this.ball.caught = false;
            const bricksLeft = this.getBricksLeft();
            const newSpeed = ballSpeed + (330 - bricksLeft); // speed up as bricks go away
            this.addBody(this.ball);
            const paddleAngle = radiansFromCenter(this.ball.hitPlayer.anchor, this.ball.hitPlayer.paddles[0]);
            const ballAngle = radiansFromCenter(this.ball.hitPlayer.anchor, this.ball);
            const delta = paddleAngle - ballAngle;
            this.box.applyForce(this.ball.id, paddleAngle - (delta * 5), newSpeed);
            this.ball.hitPaddle = null;
          }
        } else {
          const bricksLeft = this.getBricksLeft();
          const newSpeed = ballSpeed + (330 - bricksLeft); // speed up as bricks go away
          const angleOffset = getRandomAngleOffset();
          this.addBody(this.ball);
          if(this.ball.hitPaddle) {
            const paddleAngle = radiansFromCenter(this.ball.hitPlayer.anchor, this.ball.hitPlayer.paddles[0]);
            const ballAngle = radiansFromCenter(this.ball.hitPlayer.anchor, this.ball);
            const delta = paddleAngle - ballAngle;
            this.box.applyForce(this.ball.id, paddleAngle - (delta * 5) + angleOffset, newSpeed);
            this.ball.hitPaddle = null;
          } else {
            // console.log('ballhits', this.ball.wallHits, angleOffset, angleOffset * this.ball.wallHits);
            const direction = radiansFromCenter(centerPoint, this.ball.prevLinearVelocity);
            this.box.applyForce(this.ball.id, direction + angleOffset + (angleOffset * this.ball.wallHits), newSpeed);
          }
          
        }
        

      } else {
        //regulate ball speed;
    
      }
    }
    


    game.players.forEach((p, idx) => {
      if(!p.face.dead) {
        if(p.direction > 0 && p.position < Math.PI) {
          p.position += (playerSpeed * millis);
          p.position = Math.min(p.position, Math.PI);
        }
        else if(p.direction < 0 && p.position > 0) {
          p.position -= (playerSpeed * millis);
          p.position = Math.max(p.position, 0);
        }

        //const newPaddlePt = rotateRadiansAroundCenter(p.anchor, {x: p.anchor.x, y: p.anchor.y + (distFromAnchor / 30)}, p.angle + p.position - (Math.PI / 2));
        const newPaddlePt = rotateRadiansAroundCenter(p.pt, {x: p.pt.x, y: p.pt.y + distFromAnchor}, p.angle + p.position - (Math.PI / 2));
        
        const paddleOps = p.paddleOps; // Object.assign({}, p.paddleOps, newPaddlePt);
        paddleOps.x = newPaddlePt.x;
        paddleOps.y = newPaddlePt.y;
        

        paddleOps.points = [
          {x: paddleOps.halfWidth, y: -paddleOps.halfHeight},
          {x: paddleOps.halfWidth * 0.7, y: paddleOps.halfHeight / 2},
          {x: paddleOps.halfWidth * 0.4, y: paddleOps.halfHeight},
          {x: -paddleOps.halfWidth * 0.4, y: paddleOps.halfHeight},
          {x: -paddleOps.halfWidth * 0.7, y: paddleOps.halfHeight / 2},
          {x: -paddleOps.halfWidth, y: -paddleOps.halfHeight},
        ];

        if(p.firePressed) {
          paddleOps.strokeStyle = p.colorComplement;
          paddleOps.lineWidth = 5;
        } else {
          paddleOps.strokeStyle = p.color;
          paddleOps.lineWidth = 1;
        }
        
      
        paddleOps.points = p.paddleOps.points.map((oppt) => {
          return rotateRadiansAroundCenter(centerPoint, oppt, p.angle + p.position - (Math.PI / 2));
        });
        p.update++;
        paddleOps.id = idx + 'paddle' + p.update; 
        const paddle = new entities.Polygon(paddleOps);
        //const paddle2 = new entities.Polygon(Object.assign({}, paddleOps, {id: p.paddle2.id}));
        //game.removeBody(p.paddle);
        //game.removeBody(p.paddle2);
        game.addBody(paddle);
        //game.addBody(paddle2);
        p.paddles.push(paddle);
        if(p.paddles.length > 3) {
          const first = p.paddles.shift();
          game.removeBody(first);
        }
        

      }
    });

  }
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

  const newPaddlePt = rotateRadiansAroundCenter(ppt, {x: ppt.x, y: ppt.y + distFromAnchor}, p.angle);
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
game.box.applyForceDegrees('ball', Math.random() * 360, ballSpeed);
