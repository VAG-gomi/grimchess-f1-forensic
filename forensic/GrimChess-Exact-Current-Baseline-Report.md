# GrimChess — Exact Current Baseline Before Forensic Build

## Scope

This is a baseline-identification audit only. No instrumentation was added, no repair was made, no APK was rebuilt, and the supplied working tree was not modified.

The production authority is:

```text
APK: Grimchessabsolute.apk
SHA-256: 61a00ce9c1fb54a995cd6351eb15add9a46a5b60774a2264c4fa4b9e3f301fc3
```

The source archive analyzed is:

```text
Archive: Grimchess-Engine.zip
SHA-256: 38dddfd9044f4cc8ad850f6df9ea1cc54d3180dab91f4a97a9296b6daf05850f
Repository HEAD: 8c70ae800dcbf30768f5a95f7bd6e1c43c11e0ff
```

---

## A. Exact baseline

### A.1 Frozen Current APK

```text
APK SHA-256:
61a00ce9c1fb54a995cd6351eb15add9a46a5b60774a2264c4fa4b9e3f301fc3
```

### A.2 Exhaustive Git search

The recovered repository contains seven reachable commits. Every reachable commit was checked for a byte-identical:

```text
grimchess-engine/grimchess-mobile/src/App.tsx
```

against the `App.tsx` recovered from the frozen APK source map.

Result:

```text
Exact App.tsx Git commit match: NO
```

No reachable commit contains an `App.tsx` whose SHA-256 equals the frozen APK-recovered source:

```text
Frozen APK-recovered App.tsx:
2dff58d5369ab55b861dad8bf6e83810311245d94212f152821aea2722edc712
```

The archive working-tree `App.tsx` is:

```text
59b7696ce48db13ca7c79e9cae8ccb4b8b311b69ea272ec34b3f36065b9f2a48
```

The repository `HEAD` version is:

```text
fd12a3612e1f1451635196af8b199c4fd4ce4f85229f5d23b94b57c0575c395e
```

Neither matches the frozen APK-recovered `App.tsx`.

### A.3 Best matching source commit

There is no exact commit to report.

```text
Best matching source commit: NOT IDENTIFIED
Commit SHA: NOT IDENTIFIED
Commit date: NOT APPLICABLE
Branch/tag: NOT APPLICABLE
Exact App.tsx match: NO
```

Several commits contain exact matches for the shared engine/prediction files, but that does not establish that any of them produced the frozen APK because the relevant `App.tsx` does not match.

### A.4 Build metadata link

No build metadata, release script, archive note, or repository text was found that links the frozen APK hash `61a00ce9...f301fc3` or filename `Grimchessabsolute.apk` to a Git commit/tree.

The archive contains an existing release APK:

```text
releases/grimchess-release-test.apk
SHA-256: 95b0661002f8f99f4970ee7e4776e44e2a0cbb80faed75af80ce37145aae33ae
```

This is not the frozen Current APK hash and cannot be used as the production baseline without further provenance evidence.

### A.5 Relevant-source-tree decision

```text
Exact relevant-source-tree match: PARTIAL
```

The engine, prediction, classifier, simulator, and guard files match the recovered APK source content, but `App.tsx` does not. The project is therefore a real and highly relevant source tree, but not an exact identified source tree for the frozen Current APK.

### A.6 Mandatory baseline decision

```text
BASELINE STILL AMBIGUOUS
```

Per the supplied operating rule, instrumentation and forensic APK construction must stop here.

---

## B. Source hash matrix

The “APK recovered hash” column is the SHA-256 of the source file recovered from the frozen Current APK source map. The “Git/source hash” column is the SHA-256 of the corresponding file in the supplied archive working tree.

| File | APK-recovered hash | Git/source hash | Match | Notes |
|---|---|---|---|---|
| `App.tsx` | `2dff58d5369ab55b861dad8bf6e83810311245d94212f152821aea2722edc712` | `59b7696ce48db13ca7c79e9cae8ccb4b8b311b69ea272ec34b3f36065b9f2a48` | **NO** | Material session/error-guard differences |
| `StockfishAdapter.ts` | `3241e2fd20fa3ca9b2c6202778ab89add329b28d6045af56ce767507ed452773` | `3241e2fd20fa3ca9b2c6202778ab89add329b28d6045af56ce767507ed452773` | **YES** | Exact |
| `LiveAdapter.ts` | `6cb0be36ad4df61a0ad9962ca2bc916b1899157e99bec2eaf9133e755ceb1206` | `6cb0be36ad4df61a0ad9962ca2bc916b1899157e99bec2eaf9133e755ceb1206` | **YES** | Exact |
| `PredictionMap.ts` | `7c9fe03bf92c9a266302e1165374c765f78cb47fe84a8f5d2cdecfcbcbedc7b5` | `7c9fe03bf92c9a266302e1165374c765f78cb47fe84a8f5d2cdecfcbcbedc7b5` | **YES** | Exact |
| `ParadoxEngine.ts` | `73efe96c07171d60977bda43fdc34202474f300270ab60ccc315c09f0d2ed86c` | `73efe96c07171d60977bda43fdc34202474f300270ab60ccc315c09f0d2ed86c` | **YES** | Exact |
| `AsyncTaskQueue.ts` | N/A as separate source file | N/A as separate source file | N/A | Implementation is in `IntegrityGuards.ts` |
| `SessionEpochGate.ts` | N/A as separate source file | N/A as separate source file | N/A | Implementation is in `IntegrityGuards.ts` |
| `IntegrityGuards.ts` | `71ffd6374734765bf841201d27e28c476ddf27142719c74066d6d60c925979e0e` | `71ffd6374734765bf841201d27e28c476ddf27142719c74066d6d60c925979e0e` | **YES** | Contains both queue and epoch classes |
| `MoveClassifier.ts` | `bcc6962c36b8be64c63b1fa4e5b8eebac1ce12ed87dcc9bc8a295c0d7e69de7e` | `bcc6962c36b8be64c63b1fa4e5b8eebac1ce12ed87dcc9bc8a295c0d7e69de7e` | **YES** | Exact |
| `ChessSimulator.ts` | `2bef5501246fc15e85da0b22df71f4dc111943fe89bc244ff52750278430469c` | `2bef5501246fc15e85da0b22df71f4dc111943fe89bc244ff52750278430469c` | **YES** | Exact |

The recovered APK source map does not expose separate files named `AsyncTaskQueue.ts` or `SessionEpochGate.ts`; both are exported from `IntegrityGuards.ts`.

### Engine payload verification

| Asset | SHA-256 | Result |
|---|---|---|
| `stockfish-nnue-16-single.js` | `e2958bb89fc6ee0faedde87284bbb7e14da2ab224f06ca1bd82e62eaca87d00b` | Matches frozen APK |
| `stockfish-nnue-16-single.wasm` | `a7acf7f20cb81d755b39b3dd42a4bdfd6e8c8d3d203d9fbdc525e40e1f68df08` | Matches frozen APK |
| `stockfish-nnue-16.js` | `a4323fce1dd227135d2a4f00687bdb503a37f3a14f0ecc8199b37ea50fd4ab9e` | Matches frozen APK |
| `stockfish-nnue-16.wasm` | `6dee4e00888ec42efd1f74a8c605b600a59f5de79f7cbfdb432dff4f1e078bf5` | Matches frozen APK |

---

## C. `App.tsx` differences

Comparison direction:

```text
frozen APK-recovered App.tsx
VS
archive working-tree App.tsx
```

The differences are not UI-only. They affect session epoch protection, error handling, asynchronous result acceptance, and reset state. No difference in the engine adapter call arguments, candidate helper implementation, or move-selection function was identified in this comparison.

### C.1 Initial black-player engine reply

| Difference | Classification | Behavioral area |
|---|---|---|
| Frozen APK checks `sessionEpoch.isCurrent(epoch)` immediately after `getBestMove()`; archive working tree omits the check | REMOVED in archive working tree | session epoch, async timing, move/state acceptance |
| Frozen APK checks `sessionEpoch.isCurrent(epoch)` after applying the initial bot move; archive working tree omits the check | REMOVED in archive working tree | session epoch, FEN association, prediction timing |
| Frozen APK limits `setError()` in the catch block to the current epoch; archive working tree reports the error without the epoch guard | REMOVED in archive working tree | error handling, stale-result behavior |
| Frozen APK limits `setBotThinking(false)` in `finally` to the current epoch; archive working tree always clears it | REMOVED in archive working tree | async/session UI state |

### C.2 Reset behavior

| Difference | Classification | Behavioral area |
|---|---|---|
| Frozen APK explicitly calls `setLoading(false)` during reset | REMOVED in archive working tree | reset state, UI/loading |
| Frozen APK explicitly calls `setBotThinking(false)` during reset | REMOVED in archive working tree | reset state, UI/bot-thinking |

Both versions invalidate the session and reset/terminate the engine queue. The difference is that the frozen APK additionally clears the two UI state flags immediately during reset.

### C.3 Immediate bot reply after player move

| Difference | Classification | Behavioral area |
|---|---|---|
| Frozen APK checks `sessionEpoch.isCurrent(epoch)` after the queued immediate `getBestMove()` returns; archive working tree omits the check | REMOVED in archive working tree | session epoch, async timing, move application |
| The same `playUciMove()` call and engine request depth are retained | UNCHANGED | move application, engine call |

### C.4 Error/finally handling for turn processing

| Difference | Classification | Behavioral area |
|---|---|---|
| Frozen APK only sets request error if the epoch is still current; archive working tree always sets it | REMOVED in archive working tree | error handling, stale-result behavior |
| Frozen APK only clears `loading`/`botThinking` if epoch is current; archive working tree always clears them | REMOVED in archive working tree | async timing, session/UI state |

### C.5 Unchanged areas relevant to the suspected candidate failure

The following remained the same in the compared `App.tsx` versions:

- `getBestMove()` and `getTopMoves()` call depths and MultiPV values;
- `candidatesFromAnalysis()` and `candidatesFromTopMoves()` call structure;
- `PredictionMap`/`ParadoxEngine` invocation structure;
- `activeFenRef` updates after board changes;
- `playUciMove()` implementation;
- player move commit and legality checks;
- the main queued optional-analysis body;
- the candidate construction helpers themselves.

The differences can still alter whether stale work is accepted, whether the UI is cleared, and whether errors are surfaced, so they are material to runtime instrumentation.

---

## D. Dirty-tree status

```text
working tree dirty: YES
```

### Modified files

```text
M grimchess-engine/grimchess-mobile/src/App.tsx
M grimchess-engine/grimchess-mobile/src/simulator/BenchmarkRunner.ts
M grimchess-engine/grimchess-mobile/src/simulator/index.ts
M grimchess-engine/grimchess-mobile/src/simulator/types.ts
```

### Untracked files

```text
?? attached_assets/
?? grimchess-engine/grimchess-mobile/src/simulator/BenchmarkSuite.ts
?? grimchess-engine/grimchess-mobile/src/simulator/IntegrityGuards.ts
```

These files were not discarded, reset, or overwritten.

---

## E. Coherent-source assessment

The archive is a genuine and highly relevant GrimChess source/build project:

- engine adapter, candidate helper, prediction map, paradox engine, guards, classifier, and chess simulator exactly match the frozen APK source-map content;
- Stockfish assets exactly match the frozen APK;
- Capacitor and Android build configuration is present;
- the working tree contains the Current-specific async/session files.

However, the application entry point `App.tsx` does not match the frozen APK source-map content, and no Git commit matches it. There is also no build metadata tying the frozen APK hash to a commit or archive release.

The source tree is therefore coherent enough for forensic analysis, but not exact enough to be identified as the source tree that produced the frozen Current APK.

---

## F. Baseline decision

```text
BASELINE STILL AMBIGUOUS
```

Per the required stop condition, **do not begin instrumentation or build the forensic APK yet**.

The next required evidence is one of:

1. a source commit/archive containing the exact frozen APK-recovered `App.tsx` and matching relevant tree;
2. build metadata linking the frozen APK hash to a source commit/tree;
3. an explicit authoritative decision about whether the forensic build should use the APK-recovered `App.tsx` snapshot as the baseline despite the absence of an exact Git commit.

Until that ambiguity is resolved, a forensic APK could accidentally instrument a source tree with different session/error behavior than the frozen Current application.

**No instrumentation was added. No APK was built.**
