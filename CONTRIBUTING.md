# Contributing

Thanks for improving Daggerheart.su Companion.

## Development flow

1. Create a focused branch.
2. Edit `daggerheart-su-companion.user.js` directly; it is both source and installable artifact.
3. Keep English and Russian behavior aligned.
4. Increase `@version` for every distributable update.
5. Run `scripts/validate.ps1`.
6. Test the relevant parts of `docs/TESTING.md` in at least one Chromium browser and Firefox when browser-sensitive behavior changes.
7. Include screenshots for visual changes and a saved-PDF check for print changes.

## Project constraints

- Keep `@match` limited to the three supported Daggerheart.su origins.
- Do not add remote executable code, `@require`, telemetry, ads, or tracking.
- Add a new `@grant` only when a documented feature cannot use the existing APIs.
- Treat ratings, translations, game text, art, and website content as third-party material.
- Verify terminology against the site's current English and Russian text.
- Avoid changing rating meaning or game mechanics when editing commentary.

The root userscript is the distributable artifact. Do not commit generated copies or release bundles.
