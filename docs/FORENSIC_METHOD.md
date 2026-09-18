# Forensic Method

This archive uses explicit evidence classes so that a structural result is not presented as a device-level causal finding.

| Class | Meaning in this investigation |
|---|---|
| **Observation** | A directly recorded artifact fact, such as a hash, source line, manifest entry, or static marker. |
| **Structural confirmation** | A code-level result showing that a path is possible, without proving that the path occurred in the reported game. |
| **Controlled test** | A deliberately constructed input applied to recovered logic. It is not a live-game trace. |
| **Live reproduction** | Execution of the F1 APK on an Android device or emulator with a recorded result. This remains pending. |
| **Runtime causality** | Evidence linking the reported error to the exact live transaction, UCI response, parser output, candidate array, and failing call. This remains unproven. |
| **Inference** | A reasoned interpretation that goes beyond directly recorded facts. Inferences retain their uncertainty. |
| **Conclusion** | A bounded statement supported by the available evidence. It must not exceed the strongest evidence class available. |

The investigation distinguishes “the code can produce an empty candidate array” from “this exact physical-device error was caused by that path.” Only the latter would establish runtime causality, and it requires the genuine F1 `runtime_forensic.jsonl` trace.
