
function draw(ctx, scale) {
  const {fullW, fullH, hexSide, sideW, sint1, ang1, sint2, ang2} = this.measurements;
  ctx.clearRect(0, 0, this.width, this.height);
  
  ctx.strokeStyle = this.players[0].color;
  ctx.beginPath();
  ctx.moveTo(sideW, 1);
  ctx.lineTo(fullW - sideW, 1);
  ctx.stroke();

  ctx.strokeStyle = this.players[3].color;
  ctx.beginPath();
  ctx.moveTo(sideW, fullH);
  ctx.lineTo(fullW - sideW, fullH);
  ctx.stroke();

  ctx.strokeStyle = this.players[1].color;
  ctx.beginPath();
  ctx.moveTo(fullW - sideW, 0);
  ctx.lineTo(fullW, fullH/2);
  ctx.stroke();
  
  ctx.strokeStyle = this.players[2].color;
  ctx.beginPath();
  ctx.moveTo(fullW, fullH/2);
  ctx.lineTo(fullW - sideW, fullH);
  ctx.stroke();
  
  ctx.strokeStyle = this.players[4].color;
  ctx.beginPath();
  ctx.moveTo(sideW, fullH);
  ctx.lineTo(0, fullH/2);
  ctx.stroke();
  
  ctx.strokeStyle = this.players[5].color;
  ctx.beginPath();
  ctx.moveTo(0, fullH/2);
  ctx.lineTo(sideW, 0);
  ctx.stroke();

  this.players.forEach((p) => {
    if(!p.face.dead) {
      p.paddles[0].draw(ctx, scale);
    }
    p.face.draw(ctx, scale);
  });

  Object.keys(this.entities).forEach((k) => {
    if(!this.entities[k].hidden) {
      this.entities[k].draw(ctx);
    }
  });

  
}

export default draw;