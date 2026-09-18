export const FORENSIC_BUILD_ID = 'GRIMCHESS FORENSIC RUNTIME / BASELINE: CURRENT-APK-RECOVERED / INSTRUMENTATION: F1';
const JS_ASSET = 'stockfish-nnue-16-single.js';
const WASM_ASSET = 'stockfish-nnue-16-single.wasm';
const JS_SHA256 = 'e2958bb89fc6ee0faedde87284bbb7e14da2ab224f06ca1bd82e62eaca87d00b';
const WASM_SHA256 = 'a7acf7f20cb81d755b39b3dd42a4bdfd6e8c8d3d203d9fbdc525e40e1f68df08';
const APK_SHA256 = '61a00ce9c1fb54a995cd6351eb15add9a46a5b60774a2264c4fa4b9e3f301fc3';
const LOG_KEY = 'grimchess_forensic_runtime_jsonl';

type Json = Record<string, unknown>;
export interface TraceContext extends Json {
  txId?: string;
  sessionEpoch?: number;
  activeFen?: string;
  requestFen?: string;
  queuedFen?: string;
  taskId?: string;
}

class ForensicTrace {
  private sequence = 0;
  private taskSequence = 0;
  private context: TraceContext = {};
  private events: Json[] = [];

  constructor() {
    try {
      const saved = localStorage.getItem(LOG_KEY);
      if (saved) this.events = saved.split('\n').filter(Boolean).map((line) => JSON.parse(line));
    } catch { /* tracing must never affect the application */ }
    this.emit('BUILD_IDENTITY', {
      buildId: FORENSIC_BUILD_ID,
      frozenApkSha256: APK_SHA256,
      activeStockfishJs: JS_ASSET,
      activeStockfishWasm: WASM_ASSET,
      stockfishJsSha256: JS_SHA256,
      stockfishWasmSha256: WASM_SHA256,
    });
  }

  nextTransaction(operation: string): string {
    const txId = `TX-${String(++this.sequence).padStart(6, '0')}`;
    this.context = { txId, operation };
    return txId;
  }

  nextTask(): string { return `TASK-${String(++this.taskSequence).padStart(6, '0')}`; }
  setContext(context: TraceContext): void { this.context = { ...this.context, ...context }; }
  getContext(): TraceContext { return { ...this.context }; }

  emit(event: string, data: Json = {}): void {
    try {
      const record = {
        timestamp: new Date().toISOString(),
        txId: typeof data.txId === 'string' ? data.txId : this.context.txId ?? null,
        event,
        buildId: FORENSIC_BUILD_ID,
        ...data,
      };
      this.events.push(record);
      while (this.events.length > 5000) this.events.shift();
      localStorage.setItem(LOG_KEY, this.events.map((item) => JSON.stringify(item)).join('\n'));
    } catch { /* tracing must never affect the application */ }
  }

  exportJsonl(): string {
    return this.events.map((item) => JSON.stringify(item)).join('\n') + (this.events.length ? '\n' : '');
  }

  download(): void {
    try {
      const blob = new Blob([this.exportJsonl()], { type: 'application/x-ndjson' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'runtime_forensic.jsonl';
      anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch { /* tracing must never affect the application */ }
  }
}

export const forensicTrace = new ForensicTrace();
