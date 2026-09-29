---
applyTo: "packages/pn-personafisica-login/src/**/*.{ts,tsx,css}"
---

# pn-personafisica-login

Additional instructions for changes in pn-personafisica-login.

- Treat authentication flows as security-critical: preserve validation and error-path behavior.
- Do not log credentials, tokens, or sensitive session details in any environment.
- Keep UX resilient for interrupted and retry scenarios during login and redirect handling.
- Ensure accessibility of authentication screens, including labels, focus order, and keyboard usage.
- Add or update tests when changing auth state management, redirects, or session bootstrap logic.
- Use only synthetic sample data and non-real entities in mocks, test cases, and examples.
