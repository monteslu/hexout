import Circle from 'frozenjs/box2d/entities/Circle';

export default class Ball extends Circle {
  draw(ctx, scale) {
    scale = scale || this.scale || 1;
    ctx.save();
    ctx.translate(this.x * scale, this.y * scale);
    ctx.rotate(this.angle);
    ctx.translate(-(this.x) * scale, -(this.y) * scale);
    ctx.drawImage(this.img, this.x * scale - (this.img.width / 2), this.y * scale - (this.img.height / 2));
    ctx.restore();
  }
}
