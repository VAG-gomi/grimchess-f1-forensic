import type { EngineAnalysis } from './types';
import { forensicTrace } from '../forensics/ForensicTrace';

interface PendingCommand {
  command: string;
  chunks: string[];
  resolve: (value: string) => void;
  reject: (error: Error) => void;
  timer: ReturnType<typeof setTimeout>;
}

export class StockfishAdapter {
  private worker: Worker | null = null;
  private initialized = false;
  private pending: PendingCommand | null = null;
  private defaultTimeout = 45000;
  private activeTxId: string | null = null;

  constructor(private wasmPath: string = '/stockfish/stockfish-nnue-16-single.js') {}

  async init(): Promise<void> {
    if (this.initialized) return;
    this.worker = new Worker(this.wasmPath);
    this.worker.onmessage = (e: MessageEvent) => { this.handleMessage(e.data); };
    this.worker.onerror = () => {
      console.error('Stockfish worker error');
      if (this.activeTxId) forensicTrace.emit('ERROR', { txId: this.activeTxId, stage: 'worker', errorName: 'Error', errorMessage: 'Worker crashed' });
      this.rejectAll(new Error('Worker crashed'));
    };
    await this.send('uci');
    await this.send('isready');
    this.initialized = true;
  }

  terminate(): void {
    if (this.activeTxId) forensicTrace.emit('WORKER_TERMINATED', { txId: this.activeTxId });
    this.rejectAll(new Error('Terminated'));
    if (this.worker) { this.worker.terminate(); this.worker = null; }
    this.initialized = false;
    this.pending = null;
  }

  async analyze(fen: string, depth: number, multiPV = 1): Promise<EngineAnalysis> {
    const operation = multiPV === 1 ? 'analyze-single' : 'analyze-multipv';
    const txId = forensicTrace.nextTransaction(operation);
    this.activeTxId = txId;
    const fenFields = fen.split(' ');
    const previousContext = forensicTrace.getContext();
    forensicTrace.setContext({ txId, requestFen: fen, queuedFen: fen });
    forensicTrace.emit('ENGINE_REQUEST', {
      txId, fen, sideToMove: fenFields[1] ?? null, moveNumber: fenFields[5] ?? null,
      requestedDepth: depth, requestedMultiPV: multiPV, operation,
      sessionEpoch: previousContext.sessionEpoch ?? null,
      activeFen: previousContext.activeFen ?? null, queuedFen: fen,
    });
    try {
      return await this.analyzeOnce(fen, depth, multiPV);
    } catch (firstError) {
      forensicTrace.emit('ERROR', { txId, stage: 'analysis-first-attempt', errorName: firstError instanceof Error ? firstError.name : 'Error', errorMessage: String(firstError) });
      this.terminate();
      try {
        return await this.analyzeOnce(fen, depth, multiPV);
      } catch {
        forensicTrace.emit('ERROR', { txId, stage: 'analysis-retry', errorName: firstError instanceof Error ? firstError.name : 'Error', errorMessage: String(firstError) });
        throw firstError;
      }
    }
  }

  private async analyzeOnce(fen: string, depth: number, multiPV: number): Promise<EngineAnalysis> {
    await this.init();
    await this.send(`setoption name MultiPV value ${multiPV}`);
    await this.send(`position fen ${fen}`);
    const startTime = performance.now();
    const result = await this.send(`go depth ${depth}`, this.defaultTimeout);
    const timeMs = Math.round(performance.now() - startTime);
    const analysis = this.parseAnalysis(result, timeMs);
    if (this.activeTxId) forensicTrace.emit('PARSED_ANALYSIS', { txId: this.activeTxId, analysis });
    return analysis;
  }

  async getBestMove(fen: string, depth: number): Promise<{ move: string; evalCp: number }> {
    const analysis = await this.analyze(fen, depth, 1);
    return { move: analysis.bestMove, evalCp: analysis.evalCp };
  }

  async getTopMoves(fen: string, depth: number, topN: number): Promise<{ move: string; evalCp: number }[]> {
    const analysis = await this.analyze(fen, depth, topN);
    return analysis.topMoves;
  }

  private send(cmd: string, timeoutMs?: number): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.worker) { reject(new Error('Worker not initialized')); return; }
      if (this.pending) { reject(new Error('Stockfish command already pending')); return; }
      if (this.activeTxId) forensicTrace.emit('UCI_COMMAND', { txId: this.activeTxId, command: cmd });

      const expectsReply = cmd === 'uci' || cmd === 'isready' || cmd.startsWith('go ');
      if (!expectsReply) {
        this.worker.postMessage(cmd);
        resolve('');
        return;
      }

      const timer = setTimeout(() => {
        this.pending = null;
        reject(new Error(`Command timeout: ${cmd}`));
      }, timeoutMs ?? this.defaultTimeout);
      this.pending = { command: cmd, chunks: [], resolve, reject, timer };
      this.worker.postMessage(cmd);
    });
  }

  private handleMessage(data: unknown): void {
    if (typeof data !== 'string' || !this.pending) return;
    if (this.activeTxId) forensicTrace.emit('UCI_RAW_LINE', { txId: this.activeTxId, line: data });
    this.pending.chunks.push(data);
    const command = this.pending.command;
    const isDone = (command === 'uci' && data.includes('uciok'))
      || (command === 'isready' && data.includes('readyok'))
      || (command.startsWith('go ') && data.includes('bestmove'));
    if (!isDone) return;

    const pending = this.pending;
    clearTimeout(pending.timer);
    this.pending = null;
    pending.resolve(pending.chunks.join('\n'));
  }

  private rejectAll(error: Error): void {
    if (!this.pending) return;
    clearTimeout(this.pending.timer);
    this.pending.reject(error);
    this.pending = null;
  }

  private parseAnalysis(result: string, timeMs: number): EngineAnalysis {
    const lines = result.split('\n');
    const bestMatch = result.match(/bestmove\s+(\S+)/);
    const bestMove = bestMatch ? bestMatch[1] : '';
    const scoreMatch = result.match(/score\s+(cp|mate)\s+(-?\d+)/);
    let evalCp = 0;
    let evalMate: number | null = null;
    if (scoreMatch) { if (scoreMatch[1] === 'cp') evalCp = parseInt(scoreMatch[2], 10); else evalMate = parseInt(scoreMatch[2], 10); }
    const pvMatch = result.match(/pv\s+([a-h][1-8][a-h][1-8][qrbn]?\S*(?:\s+[a-h][1-8][a-h][1-8][qrbn]?\S*)*)/);
    const pv = pvMatch ? pvMatch[1].trim().split(/\s+/) : [];
    const topMoves: { move: string; evalCp: number }[] = [];
    for (const line of lines) {
      const pvM = line.match(/pv\s+([a-h][1-8][a-h][1-8][qrbn]?)/);
      const scoreM = line.match(/score\s+cp\s+(-?\d+)/);
      if (pvM && scoreM) topMoves.push({ move: pvM[1], evalCp: parseInt(scoreM[1], 10) });
    }
    const depthMatch = result.match(/info\s+.*\bdepth\s+(\d+)/);
    const depth = depthMatch ? parseInt(depthMatch[1], 10) : 0;
    return { bestMove, evalCp, evalMate, pv, depth, timeMs, topMoves };
  }
}
