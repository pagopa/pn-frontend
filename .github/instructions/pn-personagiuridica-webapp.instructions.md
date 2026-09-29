---
applyTo: "packages/pn-personagiuridica-webapp/src/**/*.{ts,tsx,css}"
---

# pn-personagiuridica-webapp

Additional instructions for changes in pn-personagiuridica-webapp.

- Preserve correctness of company-representative workflows and authorization-sensitive flows.
- Keep forms and validation rules explicit and consistent with existing domain patterns.
- Prioritize accessibility and usability for complex data-entry and table-based views.
- Keep i18n consistency: all visible strings must pass through localization resources.
- Add or update tests for behavioral changes in routing, guards, async loading, and failure states.
- Ensure examples, fixture data, and mock entities are clearly fake and non-identifiable.
