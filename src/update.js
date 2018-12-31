import { box2d, utils } from 'frozenjs';
import colors from './colors';
import PowerUp from './PowerUp';
import PowerDown from './PowerDown';
import lib from './lib';

const { entities } = box2d;
const { radiansFromCenter, rotateRadiansAroundCenter, distance } = utils;


const playerSpeed = 0.0027;
const BRICK_DEATH_ANIM = 2500;
const SMALL_TIME = 15000;

const centerPoint = {x: 0, y: 0};

const randomAngleSpread = ((Math.PI * 2) / 360) * 1.75;

function getRandomAngleOffset() {
  return Math.round(Math.random()) ? -(Math.random() * randomAngleSpread) : Math.random() * randomAngleSpread;
}


function explodeBrick(game, brick, pieces, playSound) {
  const lilOps = {
    x: brick.x * 30,
    y: brick.y * 30,
    brickPiece: true,
    life: BRICK_DEATH_ANIM,
    staticBody: false,
    density: 0.001,
    playerId: brick.playerId,
    fillStyle: colors.rgb(brick.playerId),
    drawCenter: false,
    drawLocation: false
  };
  for(let i = 0; i < pieces; i++){
    const lilbOps = {
      halfHeight: brick.halfHeight / ((Math.random() * 2) + 2.5),
      halfWidth: brick.halfWidth / ((Math.random() * 2) + 2.5),
    };
    const lilB = new entities.Rectangle(Object.assign({}, lilOps, lilbOps));
    game.addBody(lilB);
    game.box.setAngle(lilB.id, Math.random() * (Math.PI * 2));
    game.box.applyImpulse(lilB.id, Math.random() * (Math.PI * 2), 30);
  }
  if(playSound) {
    const randExplosion = game.sounds.explosions[Math.floor(Math.random() * game.sounds.explosions.length)];
    randExplosion.play(0.2);
  }
  
}

function update(millis) {
  this.updateBox(millis);
  const { scaleW, scaleH } = this.measurements;

  Object.keys(this.entities).forEach((k) => {
    const ent = this.entities[k];
    if(ent.brickPiece) {
      ent.life = ent.life - millis;
      if(ent.life < 0) {
        this.removeBody(ent);
      } else {
        ent.fillStyle = colors.rgba(ent.playerId, ent.life / BRICK_DEATH_ANIM * 0.6);
      }
    } else if(ent.power) {
      if(ent.x < 0 || ent.y < 0 || ent.x > scaleW || ent.y > scaleH ) {
        // console.log('KILL POWER', ent);
        this.removeBody(ent);
      }
      if(ent.collisions && ent.collisions.length) {
        let hitPaddle = false; //TODO make powerups not hit eachother
        ent.collisions.forEach((et) => {
          if(this.entities[et.id].paddle) {
            hitPaddle = true;
          }
        });
        if(hitPaddle) {
          console.log('GOT THE POWER', ent);
          this.removeBody(ent);
          if(ent.powerUp) {
            this.sounds.powerup.play();
            //TODO break this out into an interace
            const pBricks = lib.shuffle(Object.keys(this.entities).reduce((acc, b) => {
              const maybeBrick = this.entities[b];
              if(maybeBrick.brick && maybeBrick.playerId === ent.playerId) {
                acc.push(maybeBrick);
              }
              return acc;
            }, []));
            [0,1,2,3].forEach((idx) => {
              if(pBricks[idx]) {
                pBricks[idx].hitPoints ++;
              }
            });
          }
          else {
            this.sounds.powerdown.play();
            this.players[ent.playerId].smallTime = SMALL_TIME;
          }
        } else {
          console.log('hit other paddle', ent);
        }
        
      }
    }
  });

  if(this.ball) {
    
    if(this.ball.collisions && this.ball.collisions.length) {
      //console.log('ball', this.ball.collisions);
      this.ball.collisions.forEach((et) => {
        const ent = this.entities[et.id];
        if(ent) {
          if(ent.brick) {
            ent.hitPoints--;
            if(ent.hitPoints < 1 ) {
              this.removeBody(et);
              //console.log('brick kill', ent);
              explodeBrick(this, ent, 6, true);
              if(ent.powerUp || ent.powerDown && this.ball.hitPlayer) {
                const p = this.ball.hitPlayer;
                //console.log('hitplayer', p, p.playerId);
                if(p && !p.dead && ent.playerId !== p.playerId && !p.dead) {
                  const padAnchor = {x: (p.paddles[0].x + p.anchor.x) / 2, y: (p.paddles[0].y + p.anchor.y) / 2};
                  const powerAngle = radiansFromCenter(ent, padAnchor);
                  const mask = (1 << (8 + p.playerId));
                  //console.log('power!', ent, p, mask, p.playerId);
                  const powerOps = {
                    x: ent.x * this.box.scale,
                    y: ent.y * this.box.scale,
                    strokeStyle: p.color,
                    categoryBits: mask,
                    maskBits: mask,
                    playerId: p.playerId,
                  };
                  //console.log('powerops', powerOps);
                  const power = ent.powerUp ? new PowerUp(powerOps) : new PowerDown(powerOps);
                  this.addBody(power)
                  this.box.applyForce(power.id, powerAngle, 400);
                  //console.log('masks', power.maskBits & ent.categoryBits, power.categoryBits & ent.maskBits, power, ent);
                }
              }
            }            
          }
          else if (ent.king) {
            //console.log('king kill', ent);
            this.sounds.scream.play();
            ent.dead = true;
            this.players[ent.playerId].dead = true;

            Object.keys(this.entities).forEach((k) => {
              const brick = this.entities[k];
              if(brick.brick && brick.playerId === ent.playerId) {
                this.removeBody(brick);
                explodeBrick(this, brick, 3, false);
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
            //console.log('%cpaddlehit ' + ent.playerId, 'font-size: 1.5em; background: #222; color: ' + this.players[ent.playerId].color)
          }
          
          if (ent.wall) {
            this.ball.wallHits++;
          } else {
            this.ball.wallHits = 0;
          }
        }
        
      });
      

      this.removeBody(this.ball);
      this.ball.angularVelocity = null;
      this.ball.prevLinearVelocity = this.ball.linearVelocity;
      this.ball.linearVelocity = null;
      if(this.ball.caught) {
        const caughtPlayer = this.players[this.ball.caughtPlayerId];
        const positionDelta = caughtPlayer.position - this.ball.caughtPaddlePosition + (Math.PI * 2);
        const newBallLoc = rotateRadiansAroundCenter(caughtPlayer.anchor, this.ball.caughtPosition, positionDelta);
        // console.log('caught', positionDelta, newBallLoc);
        
        this.ball.x = newBallLoc.x;
        this.ball.y = newBallLoc.y;
        if(caughtPlayer.firePressed) {
          //still caught
        } else {
          this.ball.caught = false;
          const bricksLeft = this.getBricksLeft();
          const newSpeed = this.ballSpeed + (330 - bricksLeft); // speed up as bricks go away
          this.addBody(this.ball);
          const paddleAngle = radiansFromCenter(this.ball.hitPlayer.anchor, this.ball.hitPlayer.paddles[0]);
          const ballAngle = radiansFromCenter(this.ball.hitPlayer.anchor, this.ball);
          const delta = paddleAngle - ballAngle;
          this.box.applyForce(this.ball.id, paddleAngle - (delta * 5), newSpeed);
          this.ball.hitPaddle = null;
        }
      } else {
        const bricksLeft = this.getBricksLeft();
        const newSpeed = this.ballSpeed + (330 - bricksLeft); // speed up as bricks go away
        const angleOffset = getRandomAngleOffset();
        this.addBody(this.ball);
        if(this.ball.hitPaddle) {
          const paddleAngle = radiansFromCenter(this.ball.hitPlayer.anchor, this.ball.hitPlayer.paddles[0]);
          const ballAngle = radiansFromCenter(this.ball.hitPlayer.anchor, this.ball);
          const delta = paddleAngle - ballAngle;
          this.box.applyForce(this.ball.id, paddleAngle - (delta * 5) + angleOffset, newSpeed);
          this.ball.hitPaddle = null;
          this.sounds.paddle.play();
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

      let paddleSize = 1;
      if(p.smallTime > 0) {
        p.smallTime = p.smallTime - millis;
        paddleSize = 0.5;
      }

      //const newPaddlePt = rotateRadiansAroundCenter(p.anchor, {x: p.anchor.x, y: p.anchor.y + (distFromAnchor / 30)}, p.angle + p.position - (Math.PI / 2));
      const newPaddlePt = rotateRadiansAroundCenter(p.pt, {x: p.pt.x, y: p.pt.y + this.distFromAnchor}, p.angle + p.position - (Math.PI / 2));
      
      const paddleOps = p.paddleOps; // Object.assign({}, p.paddleOps, newPaddlePt);
      paddleOps.x = newPaddlePt.x;
      paddleOps.y = newPaddlePt.y;
      

      paddleOps.points = [
        {x: paddleOps.halfWidth * paddleSize, y: -paddleOps.halfHeight},
        {x: paddleOps.halfWidth * 0.7 * paddleSize, y: paddleOps.halfHeight / 2},
        {x: paddleOps.halfWidth * 0.4 * paddleSize, y: paddleOps.halfHeight},
        {x: -paddleOps.halfWidth * 0.4 * paddleSize, y: paddleOps.halfHeight},
        {x: -paddleOps.halfWidth * 0.7 * paddleSize, y: paddleOps.halfHeight / 2},
        {x: -paddleOps.halfWidth * paddleSize, y: -paddleOps.halfHeight},
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

export default update;