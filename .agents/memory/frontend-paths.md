---
name: Frontend relative import paths
description: Correct relative paths for hooks/utils from nested component directories
---

Hooks live at src/hooks/. Components in src/components/layout/ must use ../../hooks/ not ../hooks/.

**How to apply:** Any file two levels deep (src/components/X/File.tsx) needs ../../hooks/ to reach src/hooks/.
