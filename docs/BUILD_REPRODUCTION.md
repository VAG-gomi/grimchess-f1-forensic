# Build Reproduction

The verified environment was JDK 17.0.20, Android Gradle Plugin 8.2.1, Gradle 8.2.1, compile SDK 34, target SDK 34, minimum SDK 22, Android Build Tools 34.0.0, and Capacitor Android 6.2.2. No native NDK payload was required.

The project inputs are under `src/`. The Android project is under `src/android/`. From that directory, the verified build command was:

```bash
./gradlew assembleDebug --no-daemon
```

The expected output is approximately `src/android/app/build/outputs/apk/debug/app-debug.apk`. The frozen delivered APK is archived separately under `artifacts/`. Its expected SHA-256 is `77f33dc3a825c02a59d65c011b52956b85d081b01008ea82c7ef1c6b34b209dc`.

A fresh build requires external Android SDK platforms, Build Tools, Gradle dependencies, and npm/pnpm dependencies. Rebuilding the APK proves build reproducibility only. It does not prove Stockfish runtime behavior, trace export, error reproduction, or causal responsibility.
