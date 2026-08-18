# Contributing

Thanks for improving Daggerheart.su Companion.

## Development flow

1. Create a focused branch.
2. Edit `src/content-script.js`, `manifest.json`, or the relevant documentation.
3. Keep English and Russian UI behavior aligned.
4. Run `scripts/validate.ps1`.
5. Load the repository root as an unpacked extension and complete the relevant parts of `docs/TESTING.md`.
6. Include before/after screenshots for visual changes and a saved-PDF check for print changes.

## Project constraints

- Keep host access limited to the two Daggerheart.su origins unless a documented feature requires a reviewed change.
- Do not add remote executable code, `eval`, `new Function`, telemetry, ads, or tracking.
- Do not add privileged Chrome permissions when DOM and same-origin browser APIs are sufficient.
- Treat ratings, translations, game text, art, and website content as third-party material.
- Verify Daggerheart terminology against the site's current English and Russian text.
- Avoid changing rating meaning or game mechanics when editing commentary.

## Pull requests

Describe the user-visible result, affected pages/languages, manual tests, and any privacy or permission impact. Do not include Chrome signing keys (`.pem`) or generated `dist` artifacts in commits.
