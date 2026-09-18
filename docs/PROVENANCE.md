# Provenance Chain

The provenance chain is:

```text
Frozen Current APK
  -> APK recovery and source-map extraction
  -> reconstructed forensic baseline
  -> F1 observational instrumentation
  -> F1 Android build
  -> APK SHA-256 verification
  -> Git repository commit
```

The frozen Current APK identity is `61a00ce9c1fb54a995cd6351eb15add9a46a5b60774a2264c4fa4b9e3f301fc3`. Recovered source was materialized from APK/source-map evidence and compared against available project material. The reconstructed baseline is forensic reconstruction, not original-source provenance.

F1 added observational instrumentation around the engine request and result pipeline. The F1 instrumentation manifest identity recorded for this archive is `f8a6a9c0f97cc0a4865e91a14659796096ec4dc257ab1bc7735def2f6c166dc2`. The resulting F1 APK is preserved at `artifacts/GrimChess-Current-Forensic-F1.apk` with SHA-256 `77f33dc3a825c02a59d65c011b52956b85d081b01008ea82c7ef1c6b34b209dc`.

The archive commit that froze the initial repository was `e7af81000b901b163a125f01d8501851e6b3eaa5`. Subsequent commits add documentation only; they do not alter the F1 implementation or APK.
