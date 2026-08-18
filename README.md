# Daggerheart.su Companion

An unofficial Chrome extension for [Daggerheart.su](https://daggerheart.su/) and its [Russian version](https://ru.daggerheart.su/). It adds community ratings and filters, improves class-card layouts, and lets players collect compatible cards into a local 3×3 A4 print layout.

[Русская версия README](README.ru.md)

## Quick start

Requirements: Google Chrome or another Chromium browser, plus Windows PowerShell 5.1 or newer for validation and packaging.

1. Clone or download this repository.
2. Disable the Tampermonkey version of Daggerheart.su Companion to prevent duplicate UI.
3. Run the validation:

   ```powershell
   powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\validate.ps1
   ```

4. Open `chrome://extensions` in Chrome.
5. Enable **Developer mode**.
6. Select **Load unpacked** and choose the repository root—the folder containing `manifest.json`.
7. Open Daggerheart.su and test the cards, rating filter, selection queue, and print view.

There is no compilation step during development. Reload the extension on `chrome://extensions`, then refresh the site after changing `src/content-script.js` or `manifest.json`.

Tampermonkey's `GM_*` storage is isolated from normal site storage, so an existing Tampermonkey print queue is not migrated automatically. Print or note any important queued selection before switching.

## Build a Web Store package

For a complete release kit, run:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\prepare-release.ps1
```

To set the next Chrome version and prepare the kit in one command:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\prepare-release.ps1 -Version 7.0.1
```

For only the runtime ZIP, run:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\build.ps1
```

The script validates the manifest, JavaScript syntax, icon sizes, allowed hosts, and absence of Tampermonkey or dynamic-evaluation APIs. It then creates:

```text
dist/daggerheart-su-companion-<version>.zip
```

The archive contains only runtime files and has `manifest.json` at its root, as required by the Chrome Web Store.

## Features

- Ratings and contextual comments in Russian and English.
- Rating filters on supported Daggerheart card catalogs.
- More informative, consistently styled class cards.
- Selection of printable cards across supported pages.
- Reordering and removal in a local 3×3 print workspace.
- Mixed-ancestry print cards with a custom name and selected feature text.
- A4 print styles that omit extension ratings and controls.

## Permissions and privacy

The extension uses a static content script on only these origins:

- `https://daggerheart.su/*`
- `https://ru.daggerheart.su/*`

It requests no `tabs`, `history`, `storage`, `scripting`, background-service, or all-sites permissions. It needs site access to read and restyle the card DOM and to create the local print workspace.

Preferences and the print queue are stored in the site's `localStorage`/`sessionStorage`. The extension has no analytics, account system, or developer server. See [PRIVACY.md](PRIVACY.md) for the complete disclosure.

## Project layout

```text
manifest.json               Manifest V3 entry point
src/content-script.js       Extension behavior, embedded data, and injected styles
_locales/                   English and Russian extension metadata
icons/                      Chrome extension icons
scripts/validate.ps1        Static checks
scripts/build.ps1           Reproducible Web Store ZIP builder
scripts/prepare-release.ps1 One-command ZIP, checksum, and dashboard kit
docs/PUBLISHING.md          Step-by-step release guide
docs/STORE_LISTING.md       Prepared listing copy and permission explanations
docs/TESTING.md             Manual regression checklist
```

## Releasing

Read [docs/PUBLISHING.md](docs/PUBLISHING.md). Before a public release, confirm the redistribution terms for the ratings guide and any third-party material described in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Changes should preserve narrow host access, avoid remote executable code, and be verified on both site languages and in print preview.

## License and status

Original extension code is available under the [MIT License](LICENSE). Daggerheart names, game content, artwork, ratings, commentary, and website content are not relicensed by this project; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

This project is independent and unofficial. It is not affiliated with or endorsed by Darrington Press or Daggerheart.su.
