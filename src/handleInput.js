import keys from 'frozenjs/keys';
import radiansFromCenter from 'frozenjs/utils/radiansFromCenter';
import scalePoints from 'frozenjs/utils/scalePoints';

const speed = 10;

function handleDirection(game, fireKey ,leftKey, rightKey, playerId) {
  let lPressed = game.inputManager.keyActions[leftKey].isPressed();
  if(game.inputManager.keyActions[fireKey].isPressed()) {
    game.players[playerId].firePressed = true;
  } else {
    game.players[playerId].firePressed = false;
  }
  if(lPressed || game.inputManager.keyActions[rightKey].isPressed()) {
    if(lPressed) {
      return game.players[playerId].direction = -1;
    }
    return game.players[playerId].direction = 1;
  } 

  game.players[playerId].direction = 0;
}

function handleInput(im) {
  handleDirection(this, keys.SLASH, keys.LEFT, keys.RIGHT, 2);
  handleDirection(this, 'Q', 'W', 'E', 5);
  handleDirection(this, 'X', 'C', 'V', 4);
  handleDirection(this, 'B', 'N', 'M', 3);
  handleDirection(this, 'T', 'Y', 'U', 0);
  handleDirection(this, 'O', 'P', keys.OPEN_BRACKET, 1);


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