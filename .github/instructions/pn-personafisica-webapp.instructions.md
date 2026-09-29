---
applyTo: "packages/pn-personafisica-webapp/src/**/*.{ts,tsx,css}"
---

# pn-personafisica-webapp

Additional instructions for changes in pn-personafisica-webapp.

- Preserve user-facing behavior for citizen journeys, especially critical flows and error handling.
- Prioritize accessibility: semantic markup, keyboard operability, and clear focus states.
- Keep i18n strict: all UI strings must use the localization pipeline.
- Maintain privacy by design: avoid exposing sensitive identifiers in logs, UI messages, or fixtures.
- Update or add tests when changing navigation, forms, or API integration behavior.
- Ensure mock content and examples use clearly synthetic names and entities only.
