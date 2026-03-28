import { describe, expect, test } from 'vitest';
import { PromiseWorkerPool } from '../PromiseWorkerPool';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describe('PromiseWorkerPool', () => {
  describe('basic construction', () => {
    test('default pool size is 10', () => {
      const pool = new PromiseWorkerPool();
      expect(pool.availableWorkers).toBe(10);
    });

    test('custom pool size', () => {
      const pool = new PromiseWorkerPool(5);
      expect(pool.availableWorkers).toBe(5);
    });

    test('initial counts are zero', () => {
      const pool = new PromiseWorkerPool();
      expect(pool.successCount).toBe(0);
      expect(pool.failureCount).toBe(0);
    });
  });

  describe('queue and execution', () => {
    test('executes a single task', async () => {
      const pool = new PromiseWorkerPool(2);
      let executed = false;
      pool.queue(async () => { executed = true; });
      await pool.end();
      expect(executed).toBe(true);
      expect(pool.successCount).toBe(1);
      expect(pool.failureCount).toBe(0);
    });

    test('executes multiple tasks', async () => {
      const pool = new PromiseWorkerPool(2);
      const results: number[] = [];
      pool.queue(async () => { results.push(1); });
      pool.queue(async () => { results.push(2); });
      pool.queue(async () => { results.push(3); });
      await pool.end();
      expect(results).toEqual([1, 2, 3]);
      expect(pool.successCount).toBe(3);
    });

    test('queue returns a promise that resolves when the task starts', async () => {
      const pool = new PromiseWorkerPool(1);
      let taskStarted = false;
      const activated = pool.queue(async () => {
        taskStarted = true;
        await delay(10);
      });
      await activated;
      expect(taskStarted).toBe(true);
      await pool.end();
    });
  });

  describe('concurrency limiting', () => {
    test('respects pool size limit', async () => {
      const pool = new PromiseWorkerPool(2);
      let concurrent = 0;
      let maxConcurrent = 0;

      const makeTask = () => async () => {
        concurrent++;
        maxConcurrent = Math.max(maxConcurrent, concurrent);
        await delay(20);
        concurrent--;
      };

      pool.queue(makeTask());
      pool.queue(makeTask());
      pool.queue(makeTask());
      pool.queue(makeTask());
      pool.queue(makeTask());
      await pool.end();

      expect(maxConcurrent).toBe(2);
      expect(pool.successCount).toBe(5);
    });

    test('availableWorkers decreases as tasks run', async () => {
      const pool = new PromiseWorkerPool(3);
      let resolveTask1!: () => void;
      let resolveTask2!: () => void;

      pool.queue(() => new Promise<void>(r => { resolveTask1 = r; }));
      pool.queue(() => new Promise<void>(r => { resolveTask2 = r; }));

      await delay(0);

      expect(pool.availableWorkers).toBe(1);

      resolveTask1();
      await delay(0);
      expect(pool.availableWorkers).toBe(2);

      resolveTask2();
      await pool.end();
      expect(pool.availableWorkers).toBe(3);
    });

    test('pool size of 1 runs tasks sequentially', async () => {
      const pool = new PromiseWorkerPool(1);
      const order: number[] = [];

      pool.queue(async () => { order.push(1); await delay(10); order.push(2); });
      pool.queue(async () => { order.push(3); await delay(10); order.push(4); });
      await pool.end();

      expect(order).toEqual([1, 2, 3, 4]);
    });
  });

  describe('continuous cycling', () => {
    test('starts next task immediately when a worker frees up', async () => {
      const pool = new PromiseWorkerPool(2);
      const timeline: string[] = [];

      pool.queue(async () => { timeline.push('A-start'); await delay(30); timeline.push('A-end'); });
      pool.queue(async () => { timeline.push('B-start'); await delay(5); timeline.push('B-end'); });
      pool.queue(async () => { timeline.push('C-start'); await delay(5); timeline.push('C-end'); });
      await pool.end();

      // C should start before A ends (because B finishes first and frees a slot)
      const cStartIndex = timeline.indexOf('C-start');
      const aEndIndex = timeline.indexOf('A-end');
      expect(cStartIndex).toBeLessThan(aEndIndex);
      expect(pool.successCount).toBe(3);
    });
  });

  describe('error handling', () => {
    test('task errors reject the end promise with the original error', async () => {
      const pool = new PromiseWorkerPool(2);
      pool.queue(async () => { throw new Error('task failed'); });
      await expect(pool.end()).rejects.toThrow('task failed');
    });

    test('aborts pending tasks on first error', async () => {
      const pool = new PromiseWorkerPool(1);
      const results: string[] = [];

      pool.queue(async () => { results.push('first'); });
      pool.queue(async () => { throw new Error('boom'); });
      pool.queue(async () => { results.push('third'); });
      await expect(pool.end()).rejects.toThrow('boom');

      expect(results).toEqual(['first']);
      expect(pool.successCount).toBe(1);
      expect(pool.failureCount).toBe(1);
    });

    test('tasks that handle their own errors count as successes', async () => {
      const pool = new PromiseWorkerPool(2);
      const errors: string[] = [];

      pool.queue(async () => 'ok');
      pool.queue(async () => {
        try { throw new Error('handled'); }
        catch (e: any) { errors.push(e.message); }
      });
      pool.queue(async () => 'also ok');
      const result = await pool.end();

      expect(result).toEqual({ successCount: 3, failureCount: 0 });
      expect(errors).toEqual(['handled']);
    });

    test('abort discards remaining queued tasks', async () => {
      const pool = new PromiseWorkerPool(1);
      const executed: number[] = [];

      pool.queue(async () => { await delay(5); executed.push(1); });
      pool.queue(async () => { executed.push(2); throw new Error('fail'); });
      pool.queue(async () => { executed.push(3); });
      pool.queue(async () => { executed.push(4); });
      pool.queue(async () => { executed.push(5); });
      await expect(pool.end()).rejects.toThrow('fail');

      // Tasks 3-5 should have been discarded after task 2 failed
      expect(executed).toEqual([1, 2]);
    });

    test('catch() receives the original error', async () => {
      const pool = new PromiseWorkerPool(2);
      const originalError = new Error('catch me');
      pool.queue(async () => { throw originalError; });
      let caught: any;
      await pool.end().catch((e) => { caught = e; });
      expect(caught).toBe(originalError);
    });
  });

  describe('end() behavior', () => {
    test('resolves immediately if no tasks were queued', async () => {
      const result = await new PromiseWorkerPool(2).end();
      expect(result).toEqual({ successCount: 0, failureCount: 0 });
    });

    test('waits for active tasks to complete before resolving', async () => {
      const pool = new PromiseWorkerPool(2);
      let completed = false;
      pool.queue(async () => { await delay(20); completed = true; });
      await pool.end();
      expect(completed).toBe(true);
    });

    test('resolves with success and failure counts', async () => {
      const pool = new PromiseWorkerPool(2);
      pool.queue(async () => 'ok');
      pool.queue(async () => 'also ok');
      const result = await pool.end();
      expect(result).toEqual({ successCount: 2, failureCount: 0 });
    });

    test('drains queued tasks after end is called', async () => {
      const pool = new PromiseWorkerPool(1);
      const results: number[] = [];
      pool.queue(async () => { await delay(10); results.push(1); });
      pool.queue(async () => { results.push(2); });
      pool.queue(async () => { results.push(3); });
      await pool.end();
      expect(results).toEqual([1, 2, 3]);
    });

    test('returns the same promise on multiple calls', async () => {
      const pool = new PromiseWorkerPool(2);
      pool.queue(async () => 'ok');
      const p1 = pool.end();
      const p2 = pool.end();
      const p3 = pool.end();
      expect(p1).toBe(p2);
      expect(p2).toBe(p3);
      await p1;
    });
  });

  describe('queue after end', () => {
    test('throws if queue is called after end', async () => {
      const pool = new PromiseWorkerPool(2);
      pool.end();
      expect(() => pool.queue(async () => { })).toThrow('Cannot queue tasks after end() has been called');
    });

    test('throws even if tasks are still running when end was called', async () => {
      const pool = new PromiseWorkerPool(1);
      pool.queue(async () => await delay(50));
      const endPromise = pool.end();
      expect(() => pool.queue(async () => { })).toThrow('Cannot queue tasks after end() has been called');
      await endPromise;
    });
  });

  describe('promise compatibility', () => {
    test('then() works', async () => {
      const pool = new PromiseWorkerPool(2);
      pool.queue(async () => 'done');
      pool.end();
      const result = await pool.then(v => v);
      expect(result).toEqual({ successCount: 1, failureCount: 0 });
    });

    test('catch() works', async () => {
      const pool = new PromiseWorkerPool(2);
      pool.queue(async () => { throw new Error('oops'); });
      let caught: any;
      await pool.end().catch(e => { caught = e; });
      expect(caught).toBeInstanceOf(Error);
      expect(caught.message).toBe('oops');
    });

    test('finally() runs on success', async () => {
      const pool = new PromiseWorkerPool(2);
      pool.queue(async () => 'done');
      let finallyCalled = false;
      await pool.end().finally(() => { finallyCalled = true; });
      expect(finallyCalled).toBe(true);
    });

    test('finally() runs on error', async () => {
      const pool = new PromiseWorkerPool(2);
      pool.queue(async () => { throw new Error('fail'); });
      let finallyCalled = false;
      await pool.end().catch(() => { }).finally(() => { finallyCalled = true; });
      expect(finallyCalled).toBe(true);
    });

    test('can be used with await', async () => {
      const pool = new PromiseWorkerPool(2);
      pool.queue(async () => 42);
      pool.end();
      const result = await pool;
      expect(result).toEqual({ successCount: 1, failureCount: 0 });
    });
  });

  describe('abort()', () => {
    test('rejects the end promise', async () => {
      const pool = new PromiseWorkerPool(2);
      pool.queue(async () => await delay(50));
      pool.abort();
      await expect(pool.end()).rejects.toThrow('PromiseWorkerPool aborted');
    });

    test('rejects with custom reason', async () => {
      const pool = new PromiseWorkerPool(2);
      pool.queue(async () => await delay(50));
      pool.abort(new Error('user cancelled'));
      await expect(pool.end()).rejects.toThrow('user cancelled');
    });

    test('discards pending tasks', async () => {
      const pool = new PromiseWorkerPool(1);
      const executed: number[] = [];

      pool.queue(async () => { await delay(20); executed.push(1); });
      pool.queue(async () => { executed.push(2); });
      pool.queue(async () => { executed.push(3); });

      pool.abort();
      await pool.end().catch(() => { });

      // Only task 1 was active; tasks 2 and 3 were pending and discarded
      await delay(30);
      expect(executed).toEqual([1]);
    });

    test('multiple abort calls are safe', async () => {
      const pool = new PromiseWorkerPool(2);
      pool.queue(async () => await delay(10));
      pool.abort(new Error('first'));
      pool.abort(new Error('second'));
      await expect(pool.end()).rejects.toThrow('first');
    });
  });

  describe('backpressure (await queue for large collections)', () => {
    test('queue activation promise delays until a worker is free', async () => {
      const pool = new PromiseWorkerPool(1);
      let resolveBlockingTask!: () => void;
      const blockingTask = () => new Promise<void>(r => { resolveBlockingTask = r; });

      pool.queue(blockingTask);

      let secondTaskStarted = false;
      const secondActivated = pool.queue(async () => { secondTaskStarted = true; });

      // Second task should not have started yet (pool is full)
      await delay(0);
      expect(secondTaskStarted).toBe(false);

      // Free up the worker
      resolveBlockingTask();
      await secondActivated;
      // Task is activated but its body runs in the next microtask
      await Promise.resolve();
      expect(secondTaskStarted).toBe(true);

      await pool.end();
    });

    test('await queue() keeps pending queue bounded', async () => {
      const poolSize = 3;
      const pool = new PromiseWorkerPool(poolSize);
      let activatedCount = 0;
      let completedCount = 0;
      let maxInFlight = 0;

      for (let i = 0; i < 50; i++) {
        await pool.queue(async () => {
          activatedCount++;
          maxInFlight = Math.max(maxInFlight, activatedCount - completedCount);
          await delay(5);
          completedCount++;
        });
        // After each await queue(), the loop has only advanced because a worker
        // slot opened — so activated minus completed should never exceed poolSize
        expect(activatedCount - completedCount).toBeLessThanOrEqual(poolSize);
      }
      await pool.end();
      expect(pool.successCount).toBe(50);
      expect(maxInFlight).toBeLessThanOrEqual(poolSize);
      // Verify workers were actually running concurrently, not just one at a time
      expect(maxInFlight).toBeGreaterThan(1);
    });

    test('without await, queue builds up unbounded pending tasks', async () => {
      const pool = new PromiseWorkerPool(2);
      let maxInFlight = 0;
      let activatedCount = 0;
      let completedCount = 0;

      // Queue 20 tasks without awaiting — they all buffer immediately
      for (let i = 0; i < 20; i++) {
        pool.queue(async () => {
          activatedCount++;
          maxInFlight = Math.max(maxInFlight, activatedCount - completedCount);
          await delay(5);
          completedCount++;
        });
      }
      await pool.end();
      expect(pool.successCount).toBe(20);
      // Still respects concurrency limit for active workers
      expect(maxInFlight).toBeLessThanOrEqual(2);
    });
  });

  describe('large workloads', () => {
    test('handles many tasks with small pool', async () => {
      const pool = new PromiseWorkerPool(3);
      let count = 0;

      for (let i = 0; i < 100; i++) {
        pool.queue(async () => { count++; });
      }
      await pool.end();

      expect(count).toBe(100);
      expect(pool.successCount).toBe(100);
    });
  });
});
