# GrimChess — F1 Forensic APK Build Report

## Final decision

```text
F1 FORENSIC APK BUILT — RUNTIME NOT YET TESTED
```

The APK was built and statically verified. It was **not installed, launched, or runtime-tested**, as required.

---

## 1. Source and baseline

| Item | Path |
|---|---|
| F1 source project | `/home/ubuntu/work/GrimChess-Current-Forensic-Instrumented/grimchess-mobile` |
| Reconstructed baseline | `/home/ubuntu/work/GrimChess-Current-Forensic-Baseline/grimchess-mobile` |
| F1 instrumentation manifest | `GRIMCHESS_FORENSIC_F1_INSTRUMENTATION_MANIFEST.json` |
| Frozen production APK | `/home/ubuntu/upload/Grimchessabsolute.apk` |

The frozen production APK remains unchanged:

```text
SHA-256: 61a00ce9c1fb54a995cd6351eb15add9a46a5b60774a2264c4fa4b9e3f301fc3
```

The F1 source hashes were verified immediately before the build and were unchanged from the environment-preparation report.

---

## 2. Build environment

| Item | Value |
|---|---:|
| Gradle | `8.2.1` |
| Android Gradle Plugin | `8.2.1` |
| JDK | `17.0.20` |
| compileSdk | `34` |
| targetSdk | `34` |
| minSdk | `22` |
| Build Tools | `34.0.0` |
| Capacitor Android | `6.2.2` |
| NDK | Not required |

---

## 3. Exact build command

Executed from:

```text
/home/ubuntu/work/GrimChess-Current-Forensic-Instrumented/grimchess-mobile/android
```

With the prepared Java 17 and SDK 34 environment:

```text
./gradlew assembleDebug --no-daemon
```

Result:

```text
BUILD SUCCESSFUL in 40s
108 actionable tasks: 108 executed
```

No release signing, dependency refresh, repository change, source repair, or project configuration change was performed.

---

## 4. APK artifact

Generated APK:

```text
/home/ubuntu/work/GrimChess-Current-Forensic-Instrumented/grimchess-mobile/android/app/build/outputs/apk/debug/app-debug.apk
```

Delivered copy:

```text
/home/ubuntu/GrimChess-Current-Forensic-F1.apk
```

SHA-256:

```text
77f33dc3a825c02a59d65c011b52956b85d081b01008ea82c7ef1c6b34b209dc
```

The delivered copy and Gradle-generated APK have the same hash.

Size:

```text
4.5 MB
```

---

## 5. Static APK metadata

Obtained with `aapt dump badging`:

| Field | Value |
|---|---|
| applicationId/package | `com.grimware.chess` |
| application label | `Grimchess` |
| versionCode | `1` |
| versionName | `1.0` |
| debug/release status | **Debug** build (`assembleDebug`, `app-debug.apk`) |
| minSdk | `22` |
| targetSdk | `34` |
| compileSdk metadata | `34` / platform build `34` |
| ABI information | No `lib/` directory or `native-code` entry; no native ABI payload packaged |

The package identity is exactly the existing project identity. A separate forensic package ID was **not applied** in this phase; this is explicitly recorded because the build retained `com.grimware.chess`.

APK signature verification passed for:

```text
v1 JAR signing: true
v2 APK Signature Scheme: true
v3 APK Signature Scheme: false
Number of signers: 1
```

The APK was not modified after signing.

---

## 6. Instrumentation presence

The extracted APK contains the F1 forensic instrumentation in the packaged JavaScript bundle. Verified static markers include:

```text
GRIMCHESS FORENSIC RUNTIME
BASELINE: CURRENT-APK-RECOVERED
INSTRUMENTATION: F1
ForensicTrace
runtime_forensic.jsonl
```

The instrumentation includes:

- transaction IDs;
- engine request metadata;
- exact UCI command capture;
- complete raw UCI response-line capture;
- parsed analysis capture;
- both candidate-conversion paths;
- PredictionMap input/result/exception capture;
- session/epoch and async task events;
- FEN correlation;
- move-application trace;
- persistent JSONL storage;
- in-app `runtime_forensic.jsonl` export control.

This static presence check does not prove that the runtime trace works on a device; that requires execution in the next phase.

---

## 7. Packaged Stockfish integrity

The generated APK was extracted only into a temporary inspection directory. The packaged assets match the required frozen Current hashes:

| Asset | Packaged SHA-256 | Required SHA-256 | Result |
|---|---|---|---|
| `assets/public/stockfish/stockfish-nnue-16-single.js` | `e2958bb89fc6ee0faedde87284bbb7e14da2ab224f06ca1bd82e62eaca87d00b` | Same | **MATCH** |
| `assets/public/stockfish/stockfish-nnue-16-single.wasm` | `a7acf7f20cb81d755b39b3dd42a4bdfd6e8c8d3d203d9fbdc525e40e1f68df08` | Same | **MATCH** |

No Stockfish asset was rebuilt or substituted.

---

## 8. Installation and runtime status

```text
Installation performed: NO
Launch performed: NO
Runtime test performed: NO
ADB available: YES
Connected device/emulator: NONE
```

The APK was not passed to `adb install`, `adb shell`, or any emulator/device command.

A successful build proves only:

```text
F1 source + Android toolchain → APK
```

It does not establish correct runtime behavior, Stockfish worker communication, trace export behavior, candidate failure reproduction, or causal responsibility for the original error.

---

## 9. Required next phase

The next authorized phase must provide an Android device or emulator and explicitly authorize installation/runtime testing. That phase should run the controlled Test A–D sequence and retrieve `runtime_forensic.jsonl` after each relevant failure or test batch.

No bug fix, fallback, parser change, engine setting change, candidate change, PredictionMap change, or async guard change was made during F1.
