const iterations = 1_000_000;
const testObject = {
  a: 1,
  b: 2,
  c: 3,
  d: 4,
  e: 5,
};

const run = (label, fn) => {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) fn();
  const duration = performance.now() - start;
  console.log(`${label}: ${duration.toFixed(2)}ms`);
};

run('for...in + hasOwn', () => {
  let sum = 0;
  for (const key in testObject) {
    sum += testObject[key];
  }
});

run('Object.keys() + for loop', () => {
  let sum = 0;
  const keys = Object.keys(testObject);
  for (let i = 0; i < keys.length; i++) {
    sum += testObject[keys[i]];
  }
});

run('Object.entries() + for loop', () => {
  let sum = 0;
  const entries = Object.entries(testObject);
  for (let i = 0; i < entries.length; i++) {
    sum += entries[i][1];
  }
});