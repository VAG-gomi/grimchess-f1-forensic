# Evidence Index

| Evidence area | Location | Interpretation |
|---|---|---|
| Reconstructed and instrumented source | `src/src/` | F1 implementation source preserved from the frozen workspace. |
| Android and Capacitor build inputs | `src/android/`, `src/*.json`, `src/*.yaml`, `src/*.ts` | Required project and build configuration. |
| F1 instrumentation manifest | `forensic/GRIMCHESS_FORENSIC_F1_INSTRUMENTATION_MANIFEST.json`, `src/GRIMCHESS_FORENSIC_F1_INSTRUMENTATION_MANIFEST.json` | Instrumentation inventory and hashes. |
| Current baseline manifest | `forensic/GRIMCHESS_CURRENT_FORENSIC_BASELINE_MANIFEST.json` | Reconstructed baseline inventory and provenance. |
| Controlled tests | `tests/` | Deliberate harness inputs and outputs; not live-device evidence. |
| Live runtime reproduction | Not present | No physical-device F1 `runtime_forensic.jsonl` has been captured. |
| PGNs | Not present | No supplied PGN is claimed as causal evidence. |
| Reports | `forensic/*.md` | Build, reconstruction, instrumentation, and runtime-status records. |
| F1 APK | `artifacts/GrimChess-Current-Forensic-F1.apk` | Frozen binary artifact; verify with the recorded SHA-256. |
| Stockfish assets | `src/public/stockfish/` | Preserved JavaScript and WebAssembly engine payloads. |
| Build inputs | `src/android/`, `src/package.json`, lockfiles, Capacitor config | Inputs needed for an attempted reproduction. |
