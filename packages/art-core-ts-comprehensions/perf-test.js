const iterations = 10_000_000;
const source = Array.from({ length: 5 }, (_, i) => i);

const body = (value, key) => {
  return false;
};

const run = (label, fn) => {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) fn();
  const duration = performance.now() - start;
  console.log(`${label}: ${duration.toFixed(2)}ms`);
};

run('for-of with .entries()', () => {
  for (const [key, value] of source.entries()) {
    if (body(value, key)) break;
  }
});

run('for-of over values', () => {
  for (const value of source) {
    if (body(value, value)) break;
  }
});