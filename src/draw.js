
function draw(ctx) {
  ctx.fillStyle = '#AAA';
  //ctx.fillRect(0, 0, this.width, this.height);
  ctx.clearRect(0, 0, this.width, this.height);
  Object.keys(this.entities).forEach((k) => {
    if(!this.entities[k].hidden) {
      this.entities[k].draw(ctx);
    }
  });
}

export default draw;