export const nodes = [];
for (let i = 0; i < 100; i++) {
  nodes.push({
    r: (Math.random() * 5) + 2,
    x: 0,
    y: 0
  });
}

const random = () => 500 * Math.random();
const size = 500;

export const data = [
  {
    x: 0,
    y: random(),
  }, {
    x: random(),
    y: 0,
  }, {
    x: size,
    y: random(),
  }, {
    x: random(),
    y: size,
  }
];

const n = 500;
export const radialLineData = Array.from({ length: n }, (d, i) => {
  return { x: 2 * i * Math.PI / n, y: 120 + 40 * (1 / 2 - Math.random()) };
});
