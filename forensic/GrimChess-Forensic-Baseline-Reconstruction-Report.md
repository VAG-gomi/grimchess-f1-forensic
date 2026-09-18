# GrimChess — Forensic Baseline Reconstruction Report

## Scope and terminology

This report reconstructs an **experimental forensic baseline source tree** from the frozen Current APK’s recovered source-map content plus the supplied project’s matching build inputs.

It does **not** claim that the reconstructed tree was an original Git commit. The historical Git commit that produced the frozen Current APK remains **NOT IDENTIFIED**.

No instrumentation was added. No APK was built. The frozen Current APK and the supplied dirty project were not modified.

---

## 1. Baseline decision

```text
RECONSTRUCTED FORENSIC BASELINE
```

The decision is based on the following verified conditions:

1. All recovered Current runtime source files available from the frozen APK source maps were incorporated into the isolated tree.
2. The reconstructed `App.tsx` is byte-identical to the frozen APK-recovered `App.tsx`.
3. The recovered engine/prediction/session/move-application source files match the frozen APK source-map hashes.
4. The Stockfish assets match the frozen Current APK hashes exactly.
5. Capacitor, TypeScript, Vite, Android, Gradle, manifest, and package/lock build inputs were copied from the supplied project without modification.
6. No unresolved runtime-code divergence remains among the source files recovered from the APK.
7. The remaining project-only files are build/runtime glue retained from the supplied project, not silently substituted alternatives.

This is a **reconstructed forensic baseline**, not a claim of original-source provenance.

---

## 2. Paths and identities

### Frozen production APK

```text
/home/ubuntu/upload/Grimchessabsolute.apk
SHA-256: 61a00ce9c1fb54a995cd6351eb15add9a46a5b60774a2264c4fa4b9e3f301fc3
```

The hash was reverified after reconstruction and remains unchanged.

### Original supplied project

```text
/home/ubuntu/work/source-archive-inspect/Grimchess-Engine
Branch: main
HEAD: 8c70ae800dcbf30768f5a95f7bd6e1c43c11e0ff
Working tree: dirty
```

The original project was not reset, cleaned, stashed, checked out, or overwritten.

### New reconstructed baseline

```text
/home/ubuntu/work/GrimChess-Current-Forensic-Baseline/grimchess-mobile
```

This isolated tree contains the mobile project build inputs and source closure, without the original repository’s `.git` metadata, old release APKs, `dist`, or Android Gradle cache directories.

### Baseline manifest

```text
/home/ubuntu/work/GrimChess-Current-Forensic-Baseline/GRIMCHESS_CURRENT_FORENSIC_BASELINE_MANIFEST.json
```

The manifest records 54 entries: 18 APK-recovered runtime sources, 16 additional project source files retained for the build/source closure, and 20 project-required build inputs.

---

## 3. Historical Git result

An exhaustive search of all seven reachable repository commits found no byte-identical `App.tsx` matching the frozen APK source-map recovery.

```text
Historical Git commit: NOT IDENTIFIED
Exact App.tsx commit match: NO
```

The archive’s repository remains dirty and was preserved as supplied.

---

## 4. Reconstructed source files

The following source files were copied byte-for-byte from the frozen Current APK’s recovered `sourcesContent` into the reconstructed baseline:

```text
src/App.tsx
src/components/InitScreen.tsx
src/components/ResumeScreen.tsx
src/main.tsx
src/simulator/BenchmarkSuite.ts
src/simulator/ChessSimulator.ts
src/simulator/ForceModel.ts
src/simulator/IntegrityGuards.ts
src/simulator/MoveClassifier.ts
src/simulator/OracleService.ts
src/simulator/ReplayStore.ts
src/simulator/StockfishAdapter.ts
src/simulator/paradox/ContradictionDetector.ts
src/simulator/paradox/LiveAdapter.ts
src/simulator/paradox/MapRevisionEngine.ts
src/simulator/paradox/ParadoxEngine.ts
src/simulator/paradox/PredictionMap.ts
src/simulator/paradox/types.ts
```

### 4.1 Recovered-source hash verification

| File | Reconstructed SHA-256 | APK-recovered SHA-256 | Result |
|---|---|---|---|
| `src/App.tsx` | `2dff58d5369ab55b861dad8bf6e83810311245d94212f152821aea2722edc712` | Same | **MATCH** |
| `src/simulator/StockfishAdapter.ts` | `3241e2fd20fa3ca9b2c6202778ab89add329b28d6045af56ce767507ed452773` | Same | **MATCH** |
| `src/simulator/paradox/LiveAdapter.ts` | `6cb0be36ad4df61a0ad9962ca2bc916b1899157e99bec2eaf9133e755ceb1206` | Same | **MATCH** |
| `src/simulator/paradox/PredictionMap.ts` | `7c9fe03bf92c9a266302e1165374c765f78cb47fe84a8f5d2cdecfcbcbedc7b5` | Same | **MATCH** |
| `src/simulator/paradox/ParadoxEngine.ts` | `73efe96c07171d60977bda43fdc34202474f300270ab60ccc315c09f0d2ed86c` | Same | **MATCH** |
| `src/simulator/IntegrityGuards.ts` | `71ffd6374734765bf841201d27e28c476ddf27142719c74066d6d60c925979e0` | Same | **MATCH** |
| `src/simulator/MoveClassifier.ts` | `bcc6962c36b8be64c63b1fa4e5b8eebac1ce12ed87dcc9bc8a295c0d7e69de7e` | Same | **MATCH** |
| `src/simulator/ChessSimulator.ts` | `2bef5501246fc15e85da0b22df71f4dc111943fe89bc244ff52750278430469c` | Same | **MATCH** |
| `src/simulator/ForceModel.ts` | `f5f9f12c02e95831562e59473e5af3fd77facac0ad965cb7f9c91655800792e6` | Same recovered source | **MATCH** |
| `src/simulator/OracleService.ts` | `1d72aa0e74cf34613b52f5c93d2bc17f59b88cf998acecb052427ce8b6ed39b3` | Same recovered source | **MATCH** |
| `src/simulator/ReplayStore.ts` | `b7f41d2295b1b04f578f0ca9ca8f45e8dbe874098540be9279eaf6c8c7306ed3` | Same recovered source | **MATCH** |
| `src/simulator/paradox/ContradictionDetector.ts` | `0eb80ed96c2d63af9ed756350e733907fa8e2aa1844223418658809c3be0b03b` | Same recovered source | **MATCH** |
| `src/simulator/paradox/MapRevisionEngine.ts` | `9cfef7f9d2930323b05e4fc1ec5428dc419848e79376c9c8f50c8d69661b50b8` | Same recovered source | **MATCH** |
| `src/simulator/paradox/types.ts` | `89e00e6f66df78069613b3a6aeb89f1c2fa115b4992be20bd175db779b85b375` | Same recovered source | **MATCH** |
| `src/components/InitScreen.tsx` | `25e248ee4f41cbbb7eda85311b1561f3a86cf4fa071df25f65b3c4cba74594b6` | Same recovered source | **MATCH** |
| `src/components/ResumeScreen.tsx` | `fe2d81936a6902eb984147a7f6c989dfbf46ac9f10d3392f53492788956ce1f2` | Same recovered source | **MATCH** |
| `src/main.tsx` | `ea812f3f67551f66530a7433325a4ffb9f57b19cafcd9aa7bccb5f2b2e964cdb` | Same recovered source | **MATCH** |

The hash values above are recorded from the reconstructed tree and the previously materialized recovered source set. The manifest is the authoritative complete hash listing for the reconstructed baseline.

### 4.2 Project-only source closure

The supplied project contains additional source files not individually present in the recovered APK `sourcesContent`, including project glue and test/type files. They remain in the reconstructed tree where required by the project build, but they were not silently presented as APK-recovered evidence.

Notable project-only/build-glue files include:

```text
src/simulator/index.ts
src/simulator/BenchmarkRunner.ts
src/simulator/types.ts
src/simulator/paradox/index.ts
src/types/index.ts
src/hooks/*
src/components/Chat.tsx
src/components/ForcePanel.tsx
src/components/Sparkline.tsx
src/__tests__/*
src/engine/stockfish.ts
```

`src/simulator/index.ts` is retained as project build glue that re-exports the recovered runtime modules. Its exports are required by the recovered `App.tsx`; the file itself was not separately recovered in the APK source map. This is a build-closure fact, not a claim that its exact original source was independently recovered.

---

## 5. APK-recovered files versus supplied project

### 5.1 Runtime source comparison

| APK_RECOVERED_FILE | PROJECT_FILE | Result | APK source hash | Project source hash | Classification |
|---|---|---|---|---|---|
| `src/App.tsx` | `src/App.tsx` | DIFFER | `2dff58d...2edc712` | `59b7696...9f2a48` | RUNTIME CODE |
| 17 other recovered runtime files listed above | Corresponding project files | MATCH | Equal | Equal | RUNTIME CODE |

The `App.tsx` project version was not copied into the baseline. The recovered APK version was copied instead.

### 5.2 Complete relevant difference set

After reconstruction, all 18 recovered APK runtime files match the recovered source hashes. The only source-level difference between the supplied project working tree and the reconstructed baseline among those 18 files was `src/App.tsx`; the other 17 were already exact matches.

The `App.tsx` working-tree differences previously identified were:

- removed post-`getBestMove()` epoch check in the initial black-player path;
- removed post-initial-bot-move epoch check;
- removed epoch guard around initial engine-failure error reporting;
- removed epoch guard around initial `setBotThinking(false)`;
- removed explicit `setLoading(false)` on reset;
- removed explicit `setBotThinking(false)` on reset;
- removed epoch check after the immediate player-turn bot `getBestMove()`;
- removed epoch guard around turn-processing request errors;
- removed epoch guard around final `setLoading(false)` and `setBotThinking(false)`.

These were classified as **RUNTIME CODE** affecting session epoch, async timing, reset state, stale-result handling, and error handling. They did not change the recovered adapter, candidate helpers, PredictionMap, or legal move logic.

---

## 6. Build-input comparison and classification

The reconstructed baseline retains these project build inputs unchanged from the supplied project:

| Input | Result | Classification |
|---|---|---|
| `package.json` | Match | DEPENDENCY / BUILD CONFIGURATION |
| `pnpm-lock.yaml` | Match | DEPENDENCY |
| `tsconfig.json` | Match | BUILD CONFIGURATION |
| `tsconfig.node.json` | Match | BUILD CONFIGURATION |
| `vite.config.ts` | Match | BUILD CONFIGURATION |
| `capacitor.config.ts` | Match | BUILD CONFIGURATION / METADATA |
| Android `settings.gradle` | Match | BUILD CONFIGURATION |
| Android root `build.gradle` | Match | BUILD CONFIGURATION |
| Android `variables.gradle` | Match | BUILD CONFIGURATION |
| Android `gradle.properties` | Match | BUILD CONFIGURATION |
| Android app `build.gradle` | Match | BUILD CONFIGURATION |
| `capacitor.build.gradle` | Match | BUILD CONFIGURATION |
| `proguard-rules.pro` | Match | BUILD CONFIGURATION |
| Gradle wrapper script | Match | BUILD CONFIGURATION |
| Gradle wrapper properties | Match | BUILD CONFIGURATION |
| Android `AndroidManifest.xml` | Match | METADATA / BUILD CONFIGURATION |
| `public/stockfish/stockfish-nnue-16-single.js` | Match | ASSET |
| `public/stockfish/stockfish-nnue-16-single.wasm` | Match | ASSET |
| `public/stockfish/stockfish-nnue-16.js` | Match | ASSET |
| `public/stockfish/stockfish-nnue-16.wasm` | Match | ASSET |

No build-input difference remains between the reconstructed baseline and the supplied project for the listed files.

The prior project-only release APK, `releases/grimchess-release-test.apk`, was deliberately excluded from the reconstructed baseline because it is an old output artifact rather than a required build input.

---

## 7. Stockfish integrity

The reconstructed baseline contains the exact frozen Current Stockfish assets:

| Asset | SHA-256 | Result |
|---|---|---|
| `stockfish-nnue-16-single.js` | `e2958bb89fc6ee0faedde87284bbb7e14da2ab224f06ca1bd82e62eaca87d00b` | **MATCH** |
| `stockfish-nnue-16-single.wasm` | `a7acf7f20cb81d755b39b3dd42a4bdfd6e8c8d3d203d9fbdc525e40e1f68df08` | **MATCH** |
| `stockfish-nnue-16.js` | `a4323fce1dd227135d2a4f00687bdb503a37f3a14f0ecc8199b37ea50fd4ab9e` | **MATCH** |
| `stockfish-nnue-16.wasm` | `6dee4e00888ec42efd1f74a8c605b600a59f5de79f7cbfdb432dff4f1e078bf5` | **MATCH** |

No Stockfish asset was replaced or rebuilt.

---

## 8. `App.tsx` three-way verification

| Property | Frozen APK recovered | Supplied project working tree | Reconstructed baseline |
|---|---|---|---|
| Session epoch creation | Present | Present | Matches frozen APK |
| Session epoch increment/invalidation | Present | Present | Matches frozen APK |
| Stale-result checks | Present at the identified initial/turn/error/finally points | Some removed | Present exactly as recovered |
| Active FEN tracking | Present | Present | Matches frozen APK |
| Queued FEN/prediction matching | Present | Present | Matches frozen APK |
| Reset state clearing | Explicit loading/bot-thinking clears present | Two explicit clears absent | Matches frozen APK |
| Pending analysis cancellation | Engine termination and queue reset present | Present | Matches frozen APK |
| Error handling | Epoch guarded at identified boundaries | Some guards removed | Matches frozen APK |
| Candidate conversion | Same helpers/call structure | Same | Matches frozen APK |
| PredictionMap calls | Same | Same | Matches frozen APK |
| Bot move application | Same recovered `playUciMove()` path | Same | Matches frozen APK |
| Async task ordering | Same queue structure | Same | Matches frozen APK |
| Retry paths | Shared adapter retry unchanged | Same | Matches frozen APK |
| Analysis callbacks | Same callback structure; guard differences restored | Guard differences | Matches frozen APK |
| Game-start state | Recovered state setup | Same plus differing guard behavior | Matches frozen APK |
| Game-reset state | Recovered explicit flags and epoch behavior | Missing two explicit flag clears | Matches frozen APK |
| Game-over handling | Same recovered logic | Same | Matches frozen APK |

The reconstructed `src/App.tsx` hash exactly equals the frozen APK-recovered hash.

---

## 9. Baseline manifest

The required manifest exists at:

```text
/home/ubuntu/work/GrimChess-Current-Forensic-Baseline/GRIMCHESS_CURRENT_FORENSIC_BASELINE_MANIFEST.json
```

It records:

- every included source/build input path;
- SHA-256 for every entry;
- origin: `APK_RECOVERED`, `PROJECT_MATCH`, or `PROJECT_REQUIRED_BUILD_INPUT`;
- `verified: true` for every entry;
- frozen APK SHA-256;
- reconstruction timestamp;
- original project Git HEAD;
- original project dirty status;
- `historical_git_commit_identified: false`.

The manifest does not claim that the reconstructed tree corresponds to a Git commit.

---

## 10. Remaining uncertainty

1. The original Git commit that produced the frozen Current APK remains unidentified.
2. The source map does not independently expose every project glue file, especially `src/simulator/index.ts`; those files are retained from the supplied project to make the recovered runtime source closure buildable.
3. The supplied project’s Git working tree contains unrelated/adjacent modifications and untracked files; none were discarded, and none were used as recovered APK evidence.
4. No APK build was attempted in this phase, as required.
5. Package identity remains the project’s production identity (`com.grimware.chess`) until a later instrumentation instruction authorizes a separate forensic package decision.

These uncertainties do not leave an unresolved divergence within the recovered runtime source files or the identified build inputs. They are provenance limitations, not silent behavioral substitutions.

---

## 11. Final status

```text
RECONSTRUCTED FORENSIC BASELINE
```

The isolated reconstructed tree is ready as the target for a later, separately authorized instrumentation phase. The next phase must still be explicitly authorized; this task did not instrument, build, sign, install, or modify any APK.
