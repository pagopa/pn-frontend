---
applyTo: "packages/pn-commons/src/**/*.{ts,tsx}"
---

# pn-commons

Additional instructions for changes in pn-commons.

- Keep exported APIs stable unless a breaking change is explicitly requested.
- Favor reusable, framework-agnostic utilities over app-specific logic.
- Add or update tests whenever behavior changes in shared hooks, validators, services, or utility modules.
- Preserve strict TypeScript typing. Avoid introducing any and unsafe casts unless justified by a clear boundary.
- Keep side effects isolated and explicit; shared modules should stay predictable and easy to reuse.
- Ensure examples, mocks, and fixtures use clearly synthetic names and entities.
