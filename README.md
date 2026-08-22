# Daggerheart.su Companion

A free, cross-browser userscript for [Daggerheart.su](https://daggerheart.su/) and its [Russian version](https://ru.daggerheart.su/). It adds ratings and filters, improves class cards, and lets players collect compatible cards into a local 3×3 A4 print layout.

[Русская версия README](README.ru.md)

## Install in under two minutes

1. Install a userscript manager:
   - [Tampermonkey](https://www.tampermonkey.net/) for Chrome, Brave, Edge, Firefox, and other supported browsers.
   - [Violentmonkey](https://violentmonkey.github.io/get-it/) for Chromium browsers and Firefox.
2. Open the [direct installation link](https://raw.githubusercontent.com/artex-x/daggerheart-su-companion/main/daggerheart-su-companion.user.js).
3. Confirm installation in the userscript manager.
4. Open or refresh Daggerheart.su.

The repository must remain public for the raw installation and automatic-update URLs to work.

### Updating an older installation

The script keeps the previous `@name` and `@namespace`, so installing version 7.0.3 from GitHub should replace the older Greasy Fork/Tampermonkey copy. Check the userscript dashboard afterward and leave only one enabled copy.

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
- `https://ru.daggerheart.su/*`

The three `GM_*` grants store and synchronize the local print queue. The script contains no analytics, advertising, telemetry, remote executable dependencies, or developer server. See [PRIVACY.md](PRIVACY.md).

## Development

The installable source is the root file:

```text
daggerheart-su-companion.user.js
```

After editing it, run:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\validate.ps1
```

For local testing, open the userscript manager, replace the script with the root file's contents, save, and refresh Daggerheart.su.

## Prepare a release

To validate the script and assemble a release kit using its current version:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\prepare-release.ps1
```

To bump the metadata version and prepare the release in one command:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\prepare-release.ps1 -Version 7.0.4
```

See [docs/RELEASING.md](docs/RELEASING.md) and [docs/TESTING.md](docs/TESTING.md).

## License and third-party material

Original userscript code is available under the [MIT License](LICENSE). Daggerheart names, game content, artwork, ratings, commentary, and website content are not relicensed by this project; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

This project is independent and unofficial. It is not affiliated with or endorsed by Darrington Press or Daggerheart.su.
