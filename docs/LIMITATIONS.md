# Limitations

F1 is observational instrumentation. No repair was applied, and no fallback was added to resolve the candidate error. Runtime causality has not yet been captured because no genuine physical-device F1 trace is included.

Instrumentation can minimally affect scheduling and timing. The baseline was reconstructed from APK/source-map evidence and is not the original source repository. The exact upstream Stockfish commit is not proven. Bot Elo labels are not treated as engine-strength measurements. Inconclusive UI or state observations remain inconclusive.

Controlled tests demonstrate behavior for deliberately supplied transcripts. They do not establish what Stockfish returned in the reported game. Static presence of trace code does not prove that the trace executed, persisted, or was exported successfully on Android.

The archive cannot recover artifacts absent from the frozen workspace. External package registries, Android SDK packages, and build services remain external dependencies. The repository does not contain private credentials, relay tokens, a phone-local server, ADB data, or the pending genuine `runtime_forensic.jsonl`.
