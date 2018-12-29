
const colors = [
  [0, 221, 0],
  [221, 0, 0],
  // [238, 238, 238],
  [238, 0, 238],
  [160, 82, 45],
  [0, 0, 221],
  [255, 165, 0],
];

function rgb(id) {
  const c = colors[id];
  console.log('colors', c, id);
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

function rgba(id, a) {
  const c = colors[id];
  return `rgba(${c[0]},${c[1]},${c[2]},${a})`;
}


// // complement
// temprgb=thisrgb;
// temphsv=RGB2HSV(temprgb);
// temphsv.hue=HueShift(temphsv.hue,180.0);
// temprgb=HSV2RGB(temphsv);

function complement(id) {
  const c = colors[id];
  console.log('colorsc', c, id);
  const start = {r: c[0], g: c[1], b: c[2]};
  const hsv = RGB2HSV(start);;
  hsv.hue=HueShift(hsv.hue,180.0);
  const temprgb=HSV2RGB(hsv);
  return `rgb(${temprgb.r},${temprgb.g},${temprgb.b})`;
}

function RGB2HSV(rgb) {
    hsv = new Object();
    max=max3(rgb.r,rgb.g,rgb.b);
    dif=max-min3(rgb.r,rgb.g,rgb.b);
    hsv.saturation=(max==0.0)?0:(100*dif/max);
    if (hsv.saturation==0) hsv.hue=0;
    else if (rgb.r==max) hsv.hue=60.0*(rgb.g-rgb.b)/dif;
    else if (rgb.g==max) hsv.hue=120.0+60.0*(rgb.b-rgb.r)/dif;
    else if (rgb.b==max) hsv.hue=240.0+60.0*(rgb.r-rgb.g)/dif;
    if (hsv.hue<0.0) hsv.hue+=360.0;
    hsv.value=Math.round(max*100/255);
    hsv.hue=Math.round(hsv.hue);
    hsv.saturation=Math.round(hsv.saturation);
    return hsv;
}

// RGB2HSV and HSV2RGB are based on Color Match Remix [http://color.twysted.net/]
// which is based on or copied from ColorMatch 5K [http://colormatch.dk/]
function HSV2RGB(hsv) {
    var rgb=new Object();
    if (hsv.saturation==0) {
        rgb.r=rgb.g=rgb.b=Math.round(hsv.value*2.55);
    } else {
        hsv.hue/=60;
        hsv.saturation/=100;
        hsv.value/=100;
        i=Math.floor(hsv.hue);
        f=hsv.hue-i;
        p=hsv.value*(1-hsv.saturation);
        q=hsv.value*(1-hsv.saturation*f);
        t=hsv.value*(1-hsv.saturation*(1-f));
        switch(i) {
        case 0: rgb.r=hsv.value; rgb.g=t; rgb.b=p; break;
        case 1: rgb.r=q; rgb.g=hsv.value; rgb.b=p; break;
        case 2: rgb.r=p; rgb.g=hsv.value; rgb.b=t; break;
        case 3: rgb.r=p; rgb.g=q; rgb.b=hsv.value; break;
        case 4: rgb.r=t; rgb.g=p; rgb.b=hsv.value; break;
        default: rgb.r=hsv.value; rgb.g=p; rgb.b=q;
        }
        rgb.r=Math.round(rgb.r*255);
        rgb.g=Math.round(rgb.g*255);
        rgb.b=Math.round(rgb.b*255);
    }
    return rgb;
}

//Adding HueShift via Jacob (see comments)
function HueShift(h,s) { 
    h+=s; while (h>=360.0) h-=360.0; while (h<0.0) h+=360.0; return h; 
}

//min max via Hairgami_Master (see comments)
function min3(a,b,c) { 
    return (a<b)?((a<c)?a:c):((b<c)?b:c); 
} 
function max3(a,b,c) { 
    return (a>b)?((a>c)?a:c):((b>c)?b:c); 
}

module.exports = {
  colors,
  rgb,
  rgba,
  complement
};