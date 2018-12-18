
function draw(ctx) {
  ctx.fillStyle = '#AAA';
  ctx.fillRect(0, 0, this.width, this.height);
  Object.keys(this.entities).forEach((k) => {
    this.entities[k].draw(ctx);
  });
}

export default draw;