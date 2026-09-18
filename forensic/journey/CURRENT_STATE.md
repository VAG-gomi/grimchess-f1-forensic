# Current Investigation State

## Investigation

The investigation concerns the recurring GrimChess runtime error **“At least one engine candidate is required.”** The central question is whether the reported physical-device failure followed this chain:

```text
bestMove exists
→ topMoves is empty
→ Current candidatesFromTopMoves([]) returns []
→ PredictionMap.predict([])
→ exact exception
```

## Confirmed

The repository confirms the following at the structural or controlled-test level:

- The recovered `PredictionMap.predict()` rejects an empty candidate array with the exact target message.
- Controlled TX-CTRL-B and TX-CTRL-C produce `bestMove` while leaving `topMoves` empty.
- In the recovered Current path, empty `topMoves` become empty candidates.
- In the recovered Offline 2 path, a best-move fallback produces one candidate for the same controlled inputs.
- The F1 instrumentation source and APK were created as observational instrumentation, without a repair.
- The F1 APK hash is `77f33dc3a825c02a59d65c011b52956b85d081b01008ea82c7ef1c6b34b209dc`.

## Not proven

> **STRUCTURAL CONFIRMATION ≠ LIVE RUNTIME CAUSALITY**

No repository artifact is a genuine physical-device F1 transaction trace for the reported failure. The exact live UCI response, FEN, queue task, session epoch, candidate array, prediction-map call, and stack trace are therefore not proven. The controlled harness does not exercise the Android queue, epoch, or FEN guards.

## Weakened or rejected explanations

The repository contains no verified severe-endgame/control-game record and no verified mating-position experiment that can be used to reject or weaken a mating-position hypothesis. That proposed historical detail is **NOT VERIFIED FROM REPOSITORY** and is intentionally not presented as an event. The repository does record H6 and H7 as **NOT TESTED**, not rejected: async/session-guard and FEN-mismatch explanations remain open until live trace fields are captured.

## Frozen artifacts

The authoritative frozen Current APK hash is `61a00ce9c1fb54a995cd6351eb15add9a46a5b60774a2264c4fa4b9e3f301fc3`. The F1 APK is preserved at `artifacts/GrimChess-Current-Forensic-F1.apk`. The initial archive commit is `e7af81000b901b163a125f01d8501851e6b3eaa5`; the repository documentation snapshot is `98ecc886e7dc83b9872a3f47fa34c44a5d8cef01`. The public repository is `VAG-gomi/grimchess-f1-forensic`.

## Current F1 status

F1 instruments engine requests, raw UCI lines, parsed analysis, both candidate-conversion paths, prediction-map input and exceptions, session/epoch and asynchronous events, FEN correlation, move application, persistent JSONL storage, and export. Static presence of instrumentation does not prove that it executed successfully on a device.

## Current evidence gap

The missing artifact is a genuine F1 `runtime_forensic.jsonl` captured from the physical Android run that exhibits the error, together with enough transaction context to correlate the error to its first divergence.

## Prohibited next actions

Do not repair the candidate path, add a fallback, change engine settings, rebuild or replace the frozen APK, or claim causality from TX-CTRL-B/C alone. Do not infer an external experiment from a commit date or from a source comment.

## Next required evidence

Run the unchanged F1 build on the authorized Android device, reproduce or capture the relevant failure, and retrieve the JSONL trace. The decisive fields are transaction ID, FENs, raw UCI response, parsed analysis, `bestMove`, `topMoves`, candidate count, prediction-map input, exception, queue/session epoch, and stale/discard status. This is the smallest evidence addition that can distinguish the empty-candidate chain from an earlier parser, FEN, or async/session divergence.
