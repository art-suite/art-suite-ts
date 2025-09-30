#!/usr/bin/env node

import { eq } from './dist/index.js';

// Create a complex object structure for testing
const createTestObject = () => ({
  user: {
    id: 12345,
    name: "John Doe",
    email: "john.doe@example.com",
    profile: {
      age: 30,
      location: {
        city: "New York",
        state: "NY",
        country: "USA",
        coordinates: {
          lat: 40.7128,
          lng: -74.0060
        }
      },
      preferences: {
        theme: "dark",
        notifications: true,
        language: "en-US"
      }
    },
    orders: [
      {
        id: "order-001",
        date: "2024-01-15",
        items: [
          { productId: "prod-123", quantity: 2, price: 29.99 },
          { productId: "prod-456", quantity: 1, price: 15.50 }
        ],
        total: 75.48,
        status: "completed"
      },
      {
        id: "order-002",
        date: "2024-02-20",
        items: [
          { productId: "prod-789", quantity: 3, price: 12.00 }
        ],
        total: 36.00,
        status: "shipped"
      }
    ],
    metadata: {
      createdAt: "2023-06-01T10:00:00Z",
      lastLogin: "2024-03-15T14:30:00Z",
      tags: ["premium", "verified", "active"],
      settings: {
        privacy: "public",
        searchable: true,
        twoFactor: false
      }
    }
  },
  system: {
    version: "2.1.0",
    environment: "production",
    features: {
      analytics: true,
      caching: true,
      monitoring: false
    }
  }
});
// Create two separate but identical objects
const object1 = createTestObject();
const object2 = createTestObject();

// Performance test function
const runPerformanceTest = (iterations = 100000) => {
  console.log(`Running performance test with ${iterations.toLocaleString()} iterations...`);


  // Verify they are structurally equal but not identical
  console.log('Objects are structurally equal:', eq(object1, object2));
  console.log('Objects are not identical (different references):', object1 !== object2);

  // Warm up
  for (let i = 0; i < 1000; i++) {
    eq(object1, object2);
  }

  // Performance test
  const startTime = performance.now();

  for (let i = 0; i < iterations; i++) {
    eq(object1, object2);
  }

  const endTime = performance.now();
  const totalTime = endTime - startTime;
  const avgTime = totalTime / iterations;
  const operationsPerSecond = Math.round(iterations / (totalTime / 1000));

  console.log('\n=== Performance Results ===');
  console.log(`Total time: ${totalTime.toFixed(2)}ms`);
  console.log(`Average time per comparison: ${avgTime.toFixed(6)}ms`);
  console.log(`Operations per second: ${operationsPerSecond.toLocaleString()}`);

  return {
    totalTime,
    avgTime,
    operationsPerSecond,
    iterations
  };
};

// Run tests with different iteration counts
console.log('=== EQ Function Performance Test ===\n');

// Capture initial heap state
const initialMemory = process.memoryUsage();
console.log('=== Initial Memory State ===');
console.log(`Heap Used: ${(initialMemory.heapUsed / 1024 / 1024).toFixed(2)} MB`);
console.log(`Heap Total: ${(initialMemory.heapTotal / 1024 / 1024).toFixed(2)} MB`);
console.log(`RSS: ${(initialMemory.rss / 1024 / 1024).toFixed(2)} MB\n`);

const testConfigs = [
  { iterations: 10000, label: 'Small test' },
  { iterations: 100000, label: 'Medium test' },
  { iterations: 1000000, label: 'Large test' }
];

const results = [];

for (const config of testConfigs) {
  console.log(`\n--- ${config.label} (${config.iterations.toLocaleString()} iterations) ---`);
  const result = runPerformanceTest(config.iterations);
  results.push({ ...config, ...result });
}

// Summary
console.log('\n=== Summary ===');
console.log('Iterations | Total Time (ms) | Avg Time (μs) | Ops/sec');
console.log('-----------|-----------------|---------------|----------');

results.forEach(result => {
  const avgTimeMicroseconds = (result.avgTime * 1000).toFixed(2);
  console.log(
    `${result.iterations.toLocaleString().padStart(10)} | ` +
    `${result.totalTime.toFixed(2).padStart(15)} | ` +
    `${avgTimeMicroseconds.padStart(13)} | ` +
    `${result.operationsPerSecond.toLocaleString()}`
  );
});

// Memory usage comparison
if (process.memoryUsage) {
  const finalMemory = process.memoryUsage();
  console.log('\n=== Memory Usage Comparison ===');
  console.log('Metric        | Initial (MB) | Final (MB)   | Change (MB)');
  console.log('--------------|--------------|--------------|-------------');

  const heapUsedChange = (finalMemory.heapUsed - initialMemory.heapUsed) / 1024 / 1024;
  const heapTotalChange = (finalMemory.heapTotal - initialMemory.heapTotal) / 1024 / 1024;
  const rssChange = (finalMemory.rss - initialMemory.rss) / 1024 / 1024;

  console.log(`Heap Used     | ${(initialMemory.heapUsed / 1024 / 1024).toFixed(2).padStart(12)} | ${(finalMemory.heapUsed / 1024 / 1024).toFixed(2).padStart(12)} | ${heapUsedChange >= 0 ? '+' : ''}${heapUsedChange.toFixed(2)}`);
  console.log(`Heap Total    | ${(initialMemory.heapTotal / 1024 / 1024).toFixed(2).padStart(12)} | ${(finalMemory.heapTotal / 1024 / 1024).toFixed(2).padStart(12)} | ${heapTotalChange >= 0 ? '+' : ''}${heapTotalChange.toFixed(2)}`);
  console.log(`RSS           | ${(initialMemory.rss / 1024 / 1024).toFixed(2).padStart(12)} | ${(finalMemory.rss / 1024 / 1024).toFixed(2).padStart(12)} | ${rssChange >= 0 ? '+' : ''}${rssChange.toFixed(2)}`);
}
