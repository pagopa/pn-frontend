---
applyTo: "packages/pn-pa-webapp/src/**/*.{ts,tsx,css}"
---

# pn-pa-webapp

Additional instructions for changes in pn-pa-webapp.

- Prioritize accessibility: semantic HTML, keyboard navigation, and appropriate aria attributes when needed.
- Keep i18n consistent: user-facing strings must go through the localization flow.
- Preserve routing, guards, and error boundaries behavior when refactoring.
- When changing UI behavior, include or update tests for critical flows and edge cases.
- Keep privacy and data handling conservative: avoid exposing sensitive values in logs, UI, or test fixtures.
- Ensure sample content and mock data are clearly fake and non-identifiable.
