import Polygon from 'frozenjs/box2d/entities/Polygon';

export default class Brick extends Polygon {
  draw(ctx, scale) {
    const ogLineWidth = ctx.lineWidth;
    
    ctx.save();
    //ctx.lineWidth = this.lineWidth;
    ctx.lineWidth = 1;
    ctx.lineJoin = "round";
    ctx.fillStyle = this.fillStyle;
     const gradient = ctx.createLinearGradient(0,this.prey, 0, this.prey + this.halfHeight * 2);

     gradient.addColorStop(0, ctx.fillStyle);
     gradient.addColorStop(1, '#444');

    ctx.translate(this.prex, this.prey);
    ctx.rotate(this.preAngle);
    ctx.translate(-(this.prex), -(this.prey));
    //
    ctx.fillStyle = gradient;
    ctx.strokeStyle = this.strokeStyle;
    ctx.fillRect(
      this.prex-this.halfWidth,
      this.prey-this.halfHeight,
      this.halfWidth*2,
      this.halfHeight*2
    );
    ctx.strokeRect(
      this.prex-this.halfWidth,
      this.prey-this.halfHeight,
      this.halfWidth*2,
      this.halfHeight*2
    );
    ctx.restore();
    ctx.lineWidth = ogLineWidth;
    //super.draw(ctx, scale);
  }
}
