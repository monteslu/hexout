import Circle from 'frozenjs/box2d/entities/Circle';
import radiansFromCenter from 'frozenjs/utils/radiansFromCenter';
import rotateRadiansAroundCenter from 'frozenjs/utils/rotateRadiansAroundCenter';

export default class Ball extends Circle {
  draw(ctx, scale) {
    // scale = scale || this.scale || 1;
    // ctx.save();
    // ctx.translate(this.x * scale, this.y * scale);
    // ctx.rotate(this.angle);
    // ctx.translate(-(this.x) * scale, -(this.y) * scale);
    // ctx.drawImage(this.img, this.x * scale - (this.img.width / 2), this.y * scale - (this.img.height / 2));
    // ctx.restore();

    scale = scale || this.scale || 1;
    const x = this.x * scale;
    const y = this.y * scale;
    const radius = this.ptRadius; // / scale;
    ctx.fillStyle = 'rgba(255,127,0,0.66)';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();

    if(this.linearVelocity) {
      const tailDisruption = 0.06;
      const tailDist = 0.85;

      const rads = radiansFromCenter({x: 0, y: 0}, this.linearVelocity);
      const center = {x, y};
      const tails = [1, 2, 3, 4, 5].map((t, idx) => {
        return rotateRadiansAroundCenter(center, {x, y: y - (radius * (tailDist * t))}, rads + Math.PI + (t % 2 ? tailDisruption : -tailDisruption));
      });

      tails.forEach((t, idx) => {
        ctx.fillStyle = 'rgba(255,255,0,0.5)';
        ctx.beginPath();
        ctx.arc(t.x, t.y, radius - (radius * ((idx + 1) * 0.15)), 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
      });



    }

    


    
    

  }
}
