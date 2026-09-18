# GrimChess Forensic Investigation Journey

## 1. Origin of the investigation

The repository identifies the target as the recurring error **“At least one engine candidate is required.”** The original failing transaction, device trace, and exact date are **NOT VERIFIED FROM REPOSITORY**. The repository therefore begins with a documented problem statement, not a proven live reproduction.

## 2. Frozen Current artifact

The Current APK is identified by SHA-256 `61a00ce9c1fb54a995cd6351eb15add9a46a5b60774a2264c4fa4b9e3f301fc3`. APK/source-map material was used to reconstruct relevant source, but the original upstream source commit is not known. This distinction matters: the baseline supports forensic comparison, not a claim of original-source provenance. See [`forensic/GrimChess-Exact-Current-Baseline-Report.md`](../GrimChess-Exact-Current-Baseline-Report.md) and [`forensic/GrimChess-Forensic-Baseline-Reconstruction-Report.md`](../GrimChess-Forensic-Baseline-Reconstruction-Report.md).

## 3. Source-level investigation

Recovered logic shows two relevant candidate-construction patterns. Current uses `candidatesFromTopMoves`; Offline 2 has a `candidatesFromAnalysis` path that can fall back to `bestMove`. The recovered `PredictionMap.predict()` rejects an empty candidate array. These are **STRUCTURAL FINDINGS**, not live observations. The relevant summary is in [`forensic/GrimChess-Runtime-Forensic-Instrumentation-Report.md`](../GrimChess-Runtime-Forensic-Instrumentation-Report.md).

## 4. Candidate-generation discovery

The structural route is:

```text
bestMove exists -> topMoves is empty -> candidatesFromTopMoves([]) = [] -> PredictionMap.predict([])
```

The repository records this as H1-H4 **CONFIRMED** at the recovered-logic level. H5, the claim that this exact chain caused the real runtime error, is **UNPROVEN**.

## 5. Controlled parser tests

The controlled harness contains TX-CTRL-A, TX-CTRL-B, and TX-CTRL-C. TX-CTRL-A is a normal centipawn MultiPV line and produces one candidate. TX-CTRL-B uses a mate-score line, and TX-CTRL-C contains only `bestmove`; both leave `topMoves` empty in the tested parser model. Current then reaches the exact exception, while Offline 2 produces one fallback candidate. The complete results are in [`tests/runtime_forensic_controlled_test.jsonl`](../../tests/runtime_forensic_controlled_test.jsonl).

This is a **CONTROLLED TEST RESULT**. It did not execute the Android APK and did not capture the reported game.

## 6. Contradictory and limiting observations

The repository’s hypothesis ledger records H6, async/session-guard causality, and H7, FEN mismatch, as **NOT TESTED**. It contains no verified severe-endgame/control-game record and no verified mating-position experiment. Therefore the suggested historical claim that a severe endgame weakened a mating-position hypothesis is **NOT VERIFIED FROM REPOSITORY**. It is preserved as an explicit unknown rather than being invented as a failed event.

## 7. F1 instrumentation decision

F1 was created to observe the first divergence without repairing it. Its documented scope includes raw UCI response lines, parsed analysis, both candidate-conversion paths, prediction-map inputs and exceptions, asynchronous/session events, FEN correlation, move application, JSONL persistence, and export. See [`forensic/GRIMCHESS_FORENSIC_F1_INSTRUMENTATION_MANIFEST.json`](../GRIMCHESS_FORENSIC_F1_INSTRUMENTATION_MANIFEST.json) and [`src/src/forensics/ForensicTrace.ts`](../../src/src/forensics/ForensicTrace.ts).

## 8. F1 construction and build verification

The build report documents JDK 17.0.20, AGP 8.2.1, Gradle 8.2.1, compile and target SDK 34, minimum SDK 22, Build Tools 34.0.0, and Capacitor Android 6.2.2. The recorded command is `./gradlew assembleDebug --no-daemon`. The frozen F1 APK is preserved at [`artifacts/GrimChess-Current-Forensic-F1.apk`](../../artifacts/GrimChess-Current-Forensic-F1.apk) and has SHA-256 `77f33dc3a825c02a59d65c011b52956b85d081b01008ea82c7ef1c6b34b209dc`.

A successful build and static instrumentation check do not establish runtime behavior.

## 9. Public forensic archive

Git records the initial archive freeze in commit `e7af81000b901b163a125f01d8501851e6b3eaa5` and the later documentation snapshot in commit `98ecc886e7dc83b9872a3f47fa34c44a5d8cef01`. These commits establish repository evolution. Repository visibility, release publication, and events outside Git are **documented external evidence**, not facts inferred from commit dates.

## 10. Current state

The current bounded conclusion is **STRUCTURALLY CONFIRMED, LIVE RUNTIME CAUSALITY NOT YET PROVEN**. The repository contains no genuine physical-device `runtime_forensic.jsonl`, live raw UCI transcript, transaction ID, FEN correlation, queue/session trace, or stack trace for the reported failure. The correct overall status remains `INCONCLUSIVE_RESULT` with reproduction classification `NOT REPRODUCED`.

## 11. Remaining causal question

The next investigator must run the unchanged F1 APK in an authorized Android environment and retrieve a correlated JSONL trace. The trace must include the raw UCI response, parsed analysis, `bestMove`, `topMoves`, candidate count, prediction-map input, exception, FEN fields, queue/session epoch, and stale/discard status. Until that evidence exists, empty candidates remain a confirmed structural route and a live causal hypothesis, not a proven explanation.
