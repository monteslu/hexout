import keys from 'frozenjs/keys';
import radiansFromCenter from 'frozenjs/utils/radiansFromCenter';
import scalePoints from 'frozenjs/utils/scalePoints';

const speed = 10;

function handleDirection(game, leftKey, rightKey, playerId) {
  let lPressed = game.inputManager.keyActions[leftKey].isPressed();
  if(lPressed || game.inputManager.keyActions[rightKey].isPressed()) {
    if(lPressed) {
      return game.players[playerId].direction = -1;
    }
    return game.players[playerId].direction = 1;
  } 

  game.players[playerId].direction = 0;
}

function handleInput(im) {
  handleDirection(this, keys.LEFT, keys.RIGHT, 2);
  handleDirection(this, 'Q', 'W', 5);
  handleDirection(this, 'C', 'V', 4);
  handleDirection(this, 'N', 'M', 3);
  handleDirection(this, 'T', 'Y', 0);
  handleDirection(this, 'O', 'P', 1);


  if(im.keyActions[keys.UP].isPressed()){
    this.box.applyImpulseDegrees('ball', 0, speed);
  }

  if(im.keyActions[keys.DOWN].isPressed()){
    this.box.applyImpulseDegrees('ball', 180, speed);
  }

  if(im.keyActions.A.isPressed()){
    this.box.applyTorque('ball', -speed * 100);
  }

  if(im.keyActions.D.isPressed()){
    this.box.applyTorque('ball', speed  * 100);
  }

  // if(im.mouseAction.isPressed()){
  //   this.box.applyImpulse('ball', radiansFromCenter(this.entities.ball, scalePoints(im.mouseAction.position, 1/this.box.scale)), speed);
  // }
}

export default handleInput;