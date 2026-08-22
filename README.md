# Daggerheart.su Companion

A free, cross-browser userscript for [Daggerheart.su](https://daggerheart.su/) and its [Russian version](https://ru.daggerheart.su/). It adds ratings and filters, improves class cards, and lets players collect compatible cards into a local 3×3 A4 print layout.

[Русская версия README](README.ru.md)

## Install in under two minutes

1. Install a userscript manager:
   - [Tampermonkey](https://www.tampermonkey.net/) for Chrome, Brave, Edge, Firefox, and other supported browsers.
   - [Violentmonkey](https://violentmonkey.github.io/get-it/) for Chromium browsers and Firefox.
2. Open the [Daggerheart Companion page on Greasy Fork](https://greasyfork.org/en/scripts/591859-daggerheart-companion-ratings-class-cards-print) and choose **Install this script**.
3. Confirm installation in the userscript manager.
4. Open or refresh Daggerheart.su.

Greasy Fork is the primary installation and automatic-update channel. GitHub hosts the source code, documentation, and issue tracker.

After the one-time source-sync and repository-webhook setup, pushing a higher userscript `@version` to `main` automatically updates the existing Greasy Fork listing. CI rejects userscript changes without a version increase and verifies the published version after each main-branch push.

### Updating an older installation

Install the current release from the same Greasy Fork page. The script keeps the existing `@name` and `@namespace`, so the userscript manager should offer an update instead of creating another script. Check its dashboard afterward and leave only one enabled copy.

## Browser support

The script uses standard DOM/browser APIs plus the synchronous `GM_getValue`, `GM_setValue`, and `GM_addValueChangeListener` APIs supported by Tampermonkey and Violentmonkey.

Test targets:

- Chrome, Brave, and Edge with Tampermonkey or Violentmonkey.
- Firefox with Tampermonkey or Violentmonkey.

No Chrome Web Store purchase or browser-specific extension package is required.

## Features

- Ratings and contextual comments in Russian and English.
- Rating filters on supported Daggerheart card catalogs.
- Denser, consistently styled class cards with navigable rules links.
- Selection of printable cards across supported pages.
- Three-column review workspace with reordering and removal.
- Mixed-ancestry cards with custom names and selected feature text.
- A4 3×3 print output without ratings or userscript controls.
- Print-only highlighting of usage and recharge limits.

## Privacy and permissions

The userscript runs only on:

- `https://daggerheart.su/*`
- `https://en.daggerheart.su/*`
- `https://ru.daggerheart.su/*`

The three `GM_*` grants store and synchronize the local print queue. The script contains no analytics, advertising, telemetry, remote executable dependencies, or developer server. See [PRIVACY.md](PRIVACY.md).

## Development

The installable source is the root file:

```text
daggerheart-su-companion.user.js
```

Greasy Fork publishes this file and adds its own installation and update URLs. Do not add alternative `@downloadURL`, `@updateURL`, or `@installURL` metadata to the repository source.

After editing it, run:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\validate.ps1
```

For local testing, open the userscript manager, replace the script with the root file's contents, save, and refresh Daggerheart.su.

## Release

Increase `@version`, run validation and the relevant smoke tests, then commit and push `main`. The repository webhook asks Greasy Fork to synchronize the root userscript; GitHub Actions verifies the source and confirms that Greasy Fork published the same version. No generated release kit or `dist` artifact is required.

See [docs/RELEASING.md](docs/RELEASING.md) and [docs/TESTING.md](docs/TESTING.md).

## License and third-party material

Original userscript code and project documentation are available under the [MIT License](LICENSE). That license does not cover Daggerheart material, Daggerheart.su content, or Borfknuckles' guide. See [LICENSE-SCOPE.md](LICENSE-SCOPE.md) and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) before redistributing or monetizing a fork.

This project is unofficial fan content and is not approved or endorsed in any way by Critical Role, Darrington Press, or Daggerheart.su.
