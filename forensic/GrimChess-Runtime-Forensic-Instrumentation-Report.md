# GrimChess — Runtime Forensic Instrumentation Report

## Objective

Determine whether the exact chain below occurred in a real Current GrimChess failure:

```text
bestMove exists
→ topMoves = []
→ candidatesFromTopMoves([]) = []
→ PredictionMap.predict([])
→ Error: At least one engine candidate is required
```

**Protocol:** inspection/instrumentation only. No frozen APK, production source, Stockfish payload, parser, candidate construction, PredictionMap, async guard, state transition, or behavior was modified. No fallback was added. No engine settings, depth, or MultiPV values were changed.

---

## A. Artifact integrity

### A.1 Frozen APK hashes

| Artifact | SHA-256 | Status |
|---|---|---|
| Current: `/home/ubuntu/upload/Grimchessabsolute.apk` | `61a00ce9c1fb54a995cd6351eb15add9a46a5b60774a2264c4fa4b9e3f301fc3` | **CONFIRMED; unchanged after testing** |
| Offline 2: `/home/ubuntu/GrimChess-Offline-2.apk` | `488246fa5ac6892cd5b665aa0ed18080de54b390a317147e63e568e1223f1fda` | **CONFIRMED; unchanged after testing** |

### A.2 Shared active Stockfish hashes

| Payload | SHA-256 | Comparison |
|---|---|---|
| `stockfish-nnue-16-single.js` | `e2958bb89fc6ee0faedde87284bbb7e14da2ab224f06ca1bd82e62eaca87d00b` | Identical in both APKs |
| `stockfish-nnue-16-single.wasm` | `a7acf7f20cb81d755b39b3dd42a4bdfd6e8c8d3d203d9fbdc525e40e1f68df08` | Identical in both APKs |

The recovered Current adapter source hash remains:

```text
3241e2fd20fa3ca9b2c6202778ab89add329b28d6045af56ce767507ed452773
```

Recovered-source hashes used by the external controlled test:

```text
StockfishAdapter.ts       3241e2fd20fa3ca9b2c6202778ab89add329b28d6045af56ce767507ed452773
LiveAdapter.ts             6cb0be36ad4df61a0ad9962ca2bc916b1899157e99bec2eaf9133e755ceb1206
PredictionMap.ts           7c9fe03bf92c9a266302e1165374c765f78cb47fe84a8f5d2cdecfcbcbedc7b5
```

The source evidence is the materialized `sourcesContent` recovered from the two APK source maps. No repository commit identifier was available; these hashes are the archive identifiers for the recovered files.

### A.3 Instrumentation APK

```text
Instrumentation APK hash: N/A
```

No debug/instrumented APK was created because the supplied artifacts contain frozen compiled bundles rather than a source project/build configuration, and no Android runtime/device was available. The frozen Current APK was not replaced or overwritten.

---

## B. Exact failing transaction

```text
transactionId: NOT AVAILABLE — no live Current APK transaction could be executed
FEN: NOT AVAILABLE — no original failing FEN was supplied
caller: NOT AVAILABLE — no runtime stack/caller trace supplied
requested depth: NOT AVAILABLE at runtime
requested MultiPV: NOT AVAILABLE at runtime
```

The sandbox has no `adb`, emulator, or attached Android device. Consequently, a real Current transaction could not be started, and no live JSONL transaction trace can honestly be reported.

**Real-game reproduction status: NOT REPRODUCED.**

---

## C. Raw UCI

### C.1 Live Current trace

No live raw UCI transcript was captured. There is no runtime evidence showing what Stockfish returned for the previously reported error.

### C.2 Controlled transcript evidence

The external controlled harness used three conceptual transcripts against the recovered parser logic. These are **not claims about a real game**.

#### TX-CTRL-A — normal centipawn MultiPV line

```text
info depth 8 multipv 1 score cp 30 pv e2e4 e7e5
bestmove e2e4
```

#### TX-CTRL-B — mate score line

```text
info depth 8 multipv 1 score mate 3 pv e2e4 e7e5
bestmove e2e4
```

#### TX-CTRL-C — bestmove only

```text
bestmove e2e4
```

The complete machine-readable results are attached separately in `runtime_forensic_controlled_test.jsonl`.

---

## D. Parsed analysis

### D.1 TX-CTRL-A

```json
{
  "bestMove": "e2e4",
  "evalCp": 30,
  "evalMate": null,
  "pv": ["e2e4", "e7e5"],
  "depth": 8,
  "topMoves": [{"move": "e2e4", "evalCp": 30}]
}
```

### D.2 TX-CTRL-B

```json
{
  "bestMove": "e2e4",
  "evalCp": 0,
  "evalMate": 3,
  "pv": ["e2e4", "e7e5"],
  "depth": 8,
  "topMoves": []
}
```

This demonstrates that the recovered parser does **not** place a mate-score line into `topMoves`, because the top-move loop requires `score cp`.

### D.3 TX-CTRL-C

```json
{
  "bestMove": "e2e4",
  "evalCp": 0,
  "evalMate": null,
  "pv": [],
  "depth": 0,
  "topMoves": []
}
```

This demonstrates that the recovered parser accepts `bestmove` independently and can produce `bestMove = e2e4` with `topMoves = []`.

---

## E. Candidate conversion

### E.1 TX-CTRL-A

Both paths produce one candidate:

```json
[{"uci":"e2e4","evalCp":30}]
```

No empty-candidate condition occurs.

### E.2 TX-CTRL-B

Offline 2 path:

```text
helper: candidatesFromAnalysis
input topMoves: []
output: [{"uci":"e2e4","evalCp":0}]
count: 1
```

Current top-move path:

```text
helper: candidatesFromTopMoves
input: []
output: []
count: 0
EMPTY_CANDIDATE_GENERATION = TRUE
```

### E.3 TX-CTRL-C

Offline 2 path:

```text
helper: candidatesFromAnalysis
input topMoves: []
output: [{"uci":"e2e4","evalCp":0}]
count: 1
```

Current top-move path:

```text
helper: candidatesFromTopMoves
input: []
output: []
count: 0
EMPTY_CANDIDATE_GENERATION = TRUE
```

### E.4 Controlled result

The controlled experiment confirms the structural difference:

```text
bestMove fallback path:  [] -> [bestMove]
topMoves-only path:      [] -> []
```

This confirms the code-path mechanism but does not establish that it happened in the original runtime incident.

---

## F. Prediction

The recovered `PredictionMap.predict()` contains this exact precondition:

```ts
if (engineCandidates.length === 0) {
  throw new Error('At least one engine candidate is required');
}
```

### F.1 TX-CTRL-A

```text
Offline 2: return, candidateCount = 1
Current:   return, candidateCount = 1
```

### F.2 TX-CTRL-B

```text
Offline 2: return, candidateCount = 1
Current:   PREDICT_EXCEPTION
           name    = Error
           message = At least one engine candidate is required
```

### F.3 TX-CTRL-C

```text
Offline 2: return, candidateCount = 1
Current:   PREDICT_EXCEPTION
           name    = Error
           message = At least one engine candidate is required
```

The controlled test therefore reproduces the **exact exception message** from the recovered logic, but not inside a running APK.

---

## G. Async/session state

### G.1 Live transaction state

```text
epoch at creation:       NOT AVAILABLE
active FEN at creation:  NOT AVAILABLE
queued/requested FEN:    NOT AVAILABLE
active FEN at completion:NOT AVAILABLE
queue task ID:            NOT AVAILABLE
session epoch completion: NOT AVAILABLE
discarded/stale:          NOT AVAILABLE
prediction skipped:       NOT AVAILABLE
```

### G.2 Static code status

Current has `AsyncTaskQueue`, `SessionEpochGate`, `activeFenRef`, and FEN matching. These mechanisms can delay work or discard a stale result, but no live transaction trace proves they participated in the reported failure.

The controlled parser/candidate test does not exercise the queue, epoch, or FEN guards.

---

## H. First demonstrated divergence

**State:** `candidate construction`

**Qualification:** This is the first demonstrated divergence in the **controlled recovered-source experiment**, not the first demonstrated divergence in a real APK transaction.

The controlled case shows:

```text
same conceptual FEN
same conceptual raw UCI output
same parsed analysis: bestMove=e2e4, topMoves=[]

Offline 2:
  candidatesFromAnalysis()
  -> [{uci:e2e4, evalCp:0}]

Current top-move path:
  candidatesFromTopMoves([])
  -> []
```

The live first-divergence state remains **INCONCLUSIVE** because no real Current transaction was available.

---

## I. Causality classification

**NOT REPRODUCED** for the real Current APK failure.

More precisely:

- **Controlled recovered-source chain:** CONFIRMED.
- **Exact chain in a real GrimChess runtime:** NOT REPRODUCED.
- **Reported error caused by that exact chain:** UNPROVEN.
- **Frozen production artifact integrity:** CONFIRMED.

The result must not be labeled `CONFIRMED RUNTIME CAUSE` because the required live sequence—valid FEN, actual raw UCI transcript, runtime `topMoves=[]`, runtime `candidatesFromTopMoves([])`, runtime `PredictionMap.predict([])`, and exact exception stack—was not captured.

If that sequence is later captured, the appropriate taxonomy will be:

```text
GRIMCHESS_PERFORMANCE_FAILURE
Subcause: EMPTY_CANDIDATE_PIPELINE
```

At present the appropriate overall status is `INCONCLUSIVE_RESULT` with the reproduction classification `NOT REPRODUCED`.

---

## J. Hypothesis ledger

| ID | Hypothesis | Status | Evidence | Missing evidence |
|---|---|---|---|---|
| H1 | `bestMove` can exist while `topMoves` is empty | **CONFIRMED** | TX-CTRL-B and TX-CTRL-C reproduce it through the recovered parser; `bestmove` is parsed independently | Live Current transcript |
| H2 | Current converts empty `topMoves` to empty candidates | **CONFIRMED** | TX-CTRL-B/C: `candidatesFromTopMoves([]) = []` | Live Current call log |
| H3 | Offline 2 has a `bestMove` fallback | **CONFIRMED** | TX-CTRL-B/C: `candidatesFromAnalysis()` emits one fallback candidate | Live Offline comparable trace not required for code fact, but would confirm call-site use |
| H4 | `PredictionMap` rejects empty candidates | **CONFIRMED** | TX-CTRL-B/C produce exact exception message | Live Current stack trace |
| H5 | This exact chain caused the real runtime error | **UNPROVEN** | Static chain is complete and controlled test reproduces its logic | Exact live transaction JSONL and stack |
| H6 | Async/session guard caused the failure | **NOT TESTED** | No live queue/epoch trace | Runtime transaction with queue, epoch, FEN, discard fields |
| H7 | FEN mismatch caused the failure | **NOT TESTED** | No live requested/active FEN trace | Runtime transaction showing mismatch and downstream result |

---

## K. Repair recommendation

No repair was implemented, as required.

Only after a live trace confirms the first divergence should a repair be considered. If the exact runtime chain is confirmed, the repair decision should be evaluated at the Current candidate-pipeline call site, while preserving the observed engine settings and making a separate build. The frozen APK must remain unchanged.

If the live trace instead shows a different first divergence—such as an earlier FEN mismatch, different command, parser result, or session discard—that earlier divergence must be addressed as the primary finding rather than forcing the empty-candidate explanation.

---

## Controlled evidence files

- JSONL results: `/home/ubuntu/work/runtime_forensic_controlled_test.jsonl`
- External harness: `/home/ubuntu/work/runtime_forensic_controlled_test.js`

The harness is an analysis tool only. It did not open, rewrite, sign, rebuild, or replace either APK.

## Final status

The controlled test proves the suspected **structural** failure chain and its exact exception behavior using recovered source logic. It does **not** prove that the chain occurred during a real Current GrimChess failure. A live Android runtime/device trace is required for that causal claim.
