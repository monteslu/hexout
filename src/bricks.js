
console.log('wtf too many bricks?');

let bricks = [
  [6,1],[10,1],[14,1],[34,1],[38,1],[42,1],
  [8,3],[12,3],[16,3],[32,3],[36,3],[40,3],
  [6,5],[10,5],[14,5],[34,5],[38,5],[42,5],
  [8,7],[12,7],[16,7],[32,7],[36,7],[40,7],
  [10,9],[14,9],[18,9],[30,9],[34,9],[38,9],
  [12,11],[16,11],[20,11],[24,11],[28,11],[32,11],[36,11],
  [14,13],[18,13],[22,13],[26,13],[30,13],[34,13],
  [12,15],[16,15],[20,15],[24,15],[28,15],[32,15],[36,15],
  [18,17],[22,17],[26,17],[30,17],
  [24,19]
];


bricks = bricks.map((b) => {
  b = [b[0] * 12.5, b[1] * 12.5];
  b[0] = b[0] - 300;
  return b;
});


export default bricks;
