# GrimChess F1 Forensic Runtime Archive

> **STATUS: FORENSIC INVESTIGATION**  
> **F1: COMPLETE**  
> **REPAIR: NOT APPLIED**  
> **RUNTIME CAUSALITY: NOT YET PROVEN**

## Purpose

GrimChess F1 is an observational Android build created to investigate the recurring runtime error **“At least one engine candidate is required.”** F1 adds trace instrumentation to the reconstructed Current GrimChess source so that a future authorized Android run can record engine requests, raw UCI output, parsing, candidate construction, prediction-map input, exceptions, asynchronous state, and related identifiers.

F1 is not a repair build. No fallback candidate was added. Engine settings, Stockfish assets, parser behavior, candidate logic, and the PredictionMap contract were not changed to correct the error.

## Current status

Static source inspection and controlled tests confirm that the Current code contains a structurally possible empty-candidate path. The exact live causal chain on the physical Android device has **not** been proven because no genuine F1 runtime trace has been captured. The runtime evidence file `runtime_forensic.jsonl` remains pending.

The repository preserves the F1 source tree, Android and Capacitor build inputs, Stockfish assets, controlled JSONL harness artifacts, provenance reports, manifests, and the frozen F1 APK. It does not claim visual inspection of the application UI.

## Artifact verification

The included APK is `artifacts/GrimChess-Current-Forensic-F1.apk`. Verify it with:

```bash
sha256sum artifacts/GrimChess-Current-Forensic-F1.apk
```

Expected SHA-256:

```text
77f33dc3a825c02a59d65c011b52956b85d081b01008ea82c7ef1c6b34b209dc
```

## Reproduction

The verified build used JDK 17, Android Gradle Plugin 8.2.1, Gradle 8.2.1, compile SDK 34, target SDK 34, minimum SDK 22, Build Tools 34.0.0, and Capacitor Android 6.2.2. From `src/android/`, the verified Gradle command was:

```bash
./gradlew assembleDebug --no-daemon
```

See [`docs/BUILD_REPRODUCTION.md`](docs/BUILD_REPRODUCTION.md). Rebuilding requires external Android SDK components and dependency resolution; a successful build does not prove runtime causality.

## Evidence map

Begin with [`docs/INVESTIGATION_STATUS.md`](docs/INVESTIGATION_STATUS.md), then read [`docs/FORENSIC_METHOD.md`](docs/FORENSIC_METHOD.md), [`docs/PROVENANCE.md`](docs/PROVENANCE.md), and [`docs/EVIDENCE_INDEX.md`](docs/EVIDENCE_INDEX.md). The controlled harness is under `tests/`. The original live `runtime_forensic.jsonl` is not present.

## Repository identity

The frozen F1 repository commit is `e7af81000b901b163a125f01d8501851e6b3eaa5`. The machine-readable inventory is [`FORENSIC_MANIFEST.json`](FORENSIC_MANIFEST.json).
