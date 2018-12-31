import Rectangle from 'frozenjs/box2d/entities/Rectangle';

export default class Power extends Rectangle {
  constructor(options = {}) {
    super(Object.assign({
      halfWidth: 20,
      halfHeight: 20,
      staticBody: false,
      lineWidth: 2,
      power: true,
      drawCenter: false,
      drawLocation: false,
    }, options));
  }

  draw(ctx, scale) {
    scale = scale || this.scale || 1;
    var ogLineWidth = ctx.lineWidth;
    ctx.lineWidth = this.lineWidth;
    ctx.save();
    ctx.translate(this.x * scale, this.y * scale);
    ctx.rotate(this.angle);
    ctx.translate(-(this.x) * scale, -(this.y) * scale);
    ctx.fillStyle = '#222';
    ctx.strokeStyle = this.strokeStyle;
    ctx.fillRect(
      (this.x-this.halfWidth) * scale,
      (this.y-this.halfHeight) * scale,
      (this.halfWidth*2) * scale,
      (this.halfHeight*2) * scale
    );
    ctx.strokeRect(
      (this.x-this.halfWidth) * scale,
      (this.y-this.halfHeight) * scale,
      (this.halfWidth*2) * scale,
      (this.halfHeight*2) * scale
    );
    ctx.restore();
    ctx.lineWidth = ogLineWidth;
  }
}
