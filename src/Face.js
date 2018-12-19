import Circle from 'frozenjs/box2d/entities/Circle';

import radiansFromCenter from 'frozenjs/utils/radiansFromCenter';
import rotateRadiansAroundCenter from 'frozenjs/utils/rotateRadiansAroundCenter';

export default class Face extends Circle {
  draw(ctx, scale) {
    scale = scale || this.scale || 1;
    const scaledX = this.x * scale;
    const scaledY = this.y * scale;
    const ogLineWidth = ctx.lineWidth;
    ctx.lineWidth = 2;
    ctx.fillStyle = this.fillStyle;
    ctx.strokeStyle = this.strokeStyle;
    ctx.beginPath();
    ctx.arc(scaledX, scaledY, this.radius * scale, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.lineWidth = 1;
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.arc(scaledX - 17, scaledY - 15, 10, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(scaledX + 17, scaledY - 15, 10, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    const radsL = radiansFromCenter({x: scaledX - 17, y: scaledY - 15}, {x: this.ball.x * scale, y: this.ball.y * scale});
    const radsR = radiansFromCenter({x: scaledX + 17, y: scaledY - 15}, {x: this.ball.x * scale, y: this.ball.y * scale});

    const lIris = rotateRadiansAroundCenter({x: scaledX - 17, y: scaledY - 15}, {x: scaledX - 17, y: scaledY - 20}, radsL);
    const rIris = rotateRadiansAroundCenter({x: scaledX + 17, y: scaledY - 15}, {x: scaledX + 17, y: scaledY - 20}, radsR);

    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(lIris.x, lIris.y, 6, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(rIris.x, rIris.y, 6, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();

    ctx.lineWidth = ogLineWidth;

  }
}
