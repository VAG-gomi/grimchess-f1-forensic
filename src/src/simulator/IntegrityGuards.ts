import { forensicTrace } from '../forensics/ForensicTrace';

export interface PendingPrediction {
  id: string;
  fen: string;
}

export class SessionEpochGate {
  private epoch = 0;

  begin(): number {
    this.epoch += 1;
    forensicTrace.setContext({ sessionEpoch: this.epoch });
    forensicTrace.emit('EPOCH_CHANGED', { sessionEpoch: this.epoch, reason: 'begin' });
    return this.epoch;
  }

  invalidate(): number {
    const next = this.begin();
    forensicTrace.emit('RESET', { sessionEpoch: next });
    return next;
  }

  isCurrent(epoch: number): boolean {
    const current = epoch === this.epoch;
    forensicTrace.emit('ASYNC_GUARD_CHECK', { capturedEpoch: epoch, currentEpoch: this.epoch, stale: !current, discarded: !current, reason: current ? 'current' : 'epoch-mismatch' });
    return current;
  }
}

export class AsyncTaskQueue {
  private tail: Promise<void> = Promise.resolve();

  enqueue<T>(task: () => Promise<T>): Promise<T> {
    const taskId = forensicTrace.nextTask();
    forensicTrace.emit('TASK_CREATED', { taskId });
    const queued = this.tail.then(async () => {
      forensicTrace.emit('TASK_STARTED', { taskId, ...forensicTrace.getContext() });
      try {
        const result = await task();
        forensicTrace.emit('TASK_COMPLETED', { taskId, ...forensicTrace.getContext(), stale: false, discarded: false });
        return result;
      } catch (error) {
        forensicTrace.emit('ERROR', { taskId, stage: 'queued-task', errorName: error instanceof Error ? error.name : 'Error', errorMessage: String(error) });
        throw error;
      }
    }, async () => {
      forensicTrace.emit('TASK_STARTED', { taskId, ...forensicTrace.getContext() });
      try {
        const result = await task();
        forensicTrace.emit('TASK_COMPLETED', { taskId, ...forensicTrace.getContext(), stale: false, discarded: false });
        return result;
      } catch (error) {
        forensicTrace.emit('ERROR', { taskId, stage: 'queued-task', errorName: error instanceof Error ? error.name : 'Error', errorMessage: String(error) });
        throw error;
      }
    });
    this.tail = queued.then(() => undefined, () => undefined);
    return queued;
  }

  reset(): void {
    this.tail = Promise.resolve();
    forensicTrace.emit('TASK_QUEUE_RESET', {});
  }
}

export function predictionMatchesFen(
  prediction: PendingPrediction | null | undefined,
  fen: string,
): prediction is PendingPrediction {
  const matches = prediction?.fen === fen;
  forensicTrace.emit('PREDICTION_FEN_CHECK', { predictionFen: prediction?.fen ?? null, requestFen: fen, stale: !matches, discarded: !matches, reason: matches ? 'match' : 'fen-mismatch' });
  return matches;
}
