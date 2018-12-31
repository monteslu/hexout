import Power from './Power';

export default class PowerDown extends Power {
  constructor(options = {}) {
    super(Object.assign(options, {powerDown: true}));
  }

  draw(ctx, scale){
    super.draw(ctx, scale);
    scale = scale || this.scale || 1;
    ctx.save();
    ctx.translate(this.x * scale, this.y * scale);
    ctx.rotate(this.angle);
    ctx.translate(-(this.x) * scale, -(this.y) * scale);
    ctx.fillStyle = 'red';
    const quarter = this.halfWidth / 2;
    ctx.fillRect(
      (this.x-quarter) * scale,
      (this.y-(quarter / 2)) * scale,
      this.halfWidth * scale,
      quarter * scale
    );
    ctx.restore();
  }
}
