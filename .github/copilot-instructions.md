# Review instructions for pn-frontend

When reviewing pull requests in this repository, focus on:

- correctness of the implementation
- accessibility and usability
- security and privacy implications
- test coverage and regression risk
- consistency with the existing architecture and patterns

## Mandatory checks

- Treat each item below as blocking when violated.
- Verify that no real people names are used in mock data, examples, screenshots, test fixtures, or sample content.
- Verify that no real company names are used unless they are explicitly required by the product domain and approved.
- Verify that no real public institution names, agencies, municipalities, or other real entities are present in fake/demo/mock content.
- All placeholder content, examples, mock entities, and sample data must be clearly fake and unmistakably non-real.
- If a name could plausibly refer to a real person, company, or entity, flag it and request replacement with a clearly synthetic alternative.
- Verify that user-facing behavior changes include adequate tests or a justified reason for missing tests.
- Verify accessibility-impacting UI changes for keyboard navigation, visible focus, and semantic/aria correctness where applicable.
- Verify that user-facing text additions follow the localization flow and do not introduce hardcoded strings where i18n is expected.
- Verify that logs, fixtures, screenshots, and examples do not expose sensitive data (tokens, identifiers, personal or operational details).
- If a mandatory check cannot be validated from the diff/context, explicitly mark it as not verifiable and request evidence.

## Review style

- Be specific and actionable in comments.
- Explain why something is a problem when possible.
- Prefer blocking comments only for issues that affect correctness, safety, privacy, maintainability, or clarity.
- Do not comment on purely stylistic details unless they reduce readability or introduce inconsistency.

## Expected review behavior

- Check for missing tests when behavior changes.
- Check for broken edge cases and error handling.
- Check for accidental exposure of real data in fixtures or UI examples.
- Check that new content remains consistent with pn-frontend conventions.