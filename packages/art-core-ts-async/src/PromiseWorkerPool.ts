
const removeElementByMutatingArray = <T>(array: T[], element: T): T[] => {
  const index = array.indexOf(element);
  if (index > -1) {
    array.splice(index, 1);
  }
  return array;
};

/**
 * A Promise-based worker pool that maintains a fixed number of concurrent async tasks.
 *
 * Unlike batch approaches where all tasks in a batch must complete before the next batch
 * starts, this pool keeps all worker slots filled continuously — as each task completes,
 * the next pending task starts immediately.
 *
 * **Basic usage (modest number of items):**
 * ```ts
 * const pool = new PromiseWorkerPool(5);
 * items.forEach(item => pool.queue(() => processItem(item)));
 * const { successCount, failureCount } = await pool.end();
 * ```
 *
 * **Large/streaming collections (millions of items):**
 * ```ts
 * const pool = new PromiseWorkerPool(5);
 * for (const item of hugeCursor) {
 *   await pool.queue(() => processItem(item));
 * }
 * const { successCount, failureCount } = await pool.end();
 * ```
 *
 * In the large-collection pattern, `await pool.queue(...)` resolves as soon as a worker
 * slot becomes available, applying natural backpressure so you never build up an
 * unbounded in-memory queue of pending tasks.
 *
 * **Error handling:** Tasks should handle their own errors when possible. If a task
 * rejects without catching, the pool aborts — remaining queued tasks are discarded
 * and the `end()` promise rejects with the unhandled error.
 */
export class PromiseWorkerPool {
  private poolSize: number;
  private pendingTaskActivators: (() => Promise<any>)[];
  private resolve: ((value?: any) => void);
  private reject: ((reason?: any) => void);
  private endPromise: Promise<any>;
  private endSignaled: boolean;
  private aborted: boolean;

  private activeWorkers: Promise<any>[];
  private _successCount: number;
  private _failureCount: number;

  constructor(poolSize: number = 10) {
    this.endSignaled = false;
    this.aborted = false;
    this._successCount = 0;
    this._failureCount = 0;
    this.activeWorkers = [];
    this.poolSize = poolSize;
    this.pendingTaskActivators = [];
    this.resolve = () => { }; // placeholder until endPromise assigns the real one
    this.reject = () => { };  // placeholder until endPromise assigns the real one
    this.endPromise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  get availableWorkers() { return this.poolSize - this.activeWorkers.length; }
  get successCount() { return this._successCount; }
  get failureCount() { return this._failureCount; }

  /**
   * Add a task to the pool. The task function is called when a worker slot opens up.
   *
   * Returns a promise that resolves when the task **starts executing** (not when it
   * completes). This enables backpressure for large collections:
   *
   * ```ts
   * for (const item of massiveDataset) {
   *   // This await pauses iteration when all workers are busy,
   *   // resuming as soon as a slot opens — keeping workers fed
   *   // without buffering the entire dataset in memory.
   *   await pool.queue(() => upload(item));
   * }
   * ```
   *
   * For small collections, the returned promise can be ignored — just queue
   * everything and `await pool.end()`.
   *
   * @throws Error if called after `end()` has been called.
   */
  queue(task: () => Promise<any>) {
    if (this.endSignaled) throw new Error('Cannot queue tasks after end() has been called');

    let signalTaskActivated: any;
    const taskActivatedPromise = new Promise((resolve, reject) => signalTaskActivated = resolve);
    this.pendingTaskActivators.push(() => {
      signalTaskActivated();
      return Promise.resolve().then(task).then(
        (result) => {
          this._successCount++;
          return result;
        },
        (error) => {
          this._failureCount++;
          this._abort(error);
        });
    });
    this._activateWorker();
    return taskActivatedPromise;
  }

  /**
   * Signal that no more tasks will be queued. Returns a promise that resolves with
   * `{ successCount, failureCount }` once all queued and active tasks complete.
   *
   * If any task rejects without catching its error, or if `abort()` is called,
   * the returned promise rejects and remaining pending tasks are discarded.
   *
   * Can be called multiple times — always returns the same promise.
   */
  end(): Promise<{ successCount: number; failureCount: number; }> {
    if (!this.endSignaled) {
      this.endSignaled = true;
      if (this.activeWorkers.length === 0) this._resolveNow();
    }
    return this.endPromise;
  }

  /** Quack like a Promise — delegates to the `end()` promise. */
  then(onFulfilled?: (value: any) => any, onRejected?: (reason: any) => any): Promise<any> { return this.endPromise.then(onFulfilled, onRejected); }

  /** Quack like a Promise — delegates to the `end()` promise. */
  catch(onRejected?: (reason: any) => any): Promise<any> { return this.endPromise.catch(onRejected); }

  /** Quack like a Promise — delegates to the `end()` promise. */
  finally(onFinally?: (() => void) | null): Promise<any> { return this.endPromise.finally(onFinally); }

  /**
   * Abort the pool. Discards all pending tasks and rejects the `end()` promise.
   * Active tasks will still run to completion but their results are ignored.
   *
   * @param reason - Optional reason for aborting. Defaults to a generic abort error.
   */
  abort(reason?: any) {
    this._abort(reason ?? new Error('PromiseWorkerPool aborted'));
  }

  /********************************************
   * PRIVATE METHODS
   *******************************************/

  private _resolveNow() {
    this.resolve({ successCount: this.successCount, failureCount: this.failureCount });
  }

  private _abort(error: any) {
    if (this.aborted) return;
    this.aborted = true;
    this.pendingTaskActivators.length = 0;
    this.reject(error);
  }

  private _activateWorker() {
    if (this.aborted) return;
    if (this.availableWorkers > 0) {
      const taskActivator = this.pendingTaskActivators.shift();
      if (taskActivator) {
        const workerPromise = taskActivator();
        this.activeWorkers.push(workerPromise);
        workerPromise.then(() => {
          removeElementByMutatingArray(this.activeWorkers, workerPromise);
          this._activateWorker();
          if (this.endSignaled && this.activeWorkers.length === 0) this._resolveNow();
        });
      }
    }
  }
}
