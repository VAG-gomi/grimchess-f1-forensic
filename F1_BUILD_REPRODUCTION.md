# F1 Build Reproduction

The source tree contains the available Node, Vite, Capacitor, Android Gradle, wrapper, and Stockfish build inputs. Supporting reports under `forensic/` preserve the available build details. A fresh reproduction must verify Java, Android SDK, build-tools, Gradle, Node, and npm/pnpm versions before building.

Expected sequence: install dependencies from the checked-in lockfile, build the web application, synchronize Capacitor, then invoke the Android debug assembly task using the checked-in Gradle wrapper. The included APK is the frozen artifact previously produced. No live Android transaction is asserted by this archive.
