# Privacy policy

Last updated: 2026-08-18

Daggerheart.su Companion is an unofficial browser extension that enhances card catalogs on `daggerheart.su` and `ru.daggerheart.su`.

## Data the extension processes

To provide its single purpose, the extension reads the visible page structure and card content on those two website origins. It uses that information to add ratings and filters, restyle class cards, and prepare selected cards for printing.

When a class card needs additional feature text, the extension may request another page from the same Daggerheart.su origin. These requests use the browser's existing connection to the site.

The print queue may contain card HTML, card identifiers, ordering, a custom mixed-ancestry name, and selected feature text. The rating-filter preference is also retained for supported pages.

## Storage

The extension stores the print queue in the Daggerheart.su origin's `localStorage` and the active rating filter in `sessionStorage`. This data stays in the user's browser and can be removed by clearing site data for Daggerheart.su or removing queued cards.

The extension does not use Chrome account sync.

## Collection, transmission, and sharing

The extension developer does not collect, receive, sell, or share personal data, browsing history, card selections, or print-queue contents. The extension contains no analytics, advertising SDK, telemetry endpoint, developer account system, or remote executable code.

The extension modifies pages served by Daggerheart.su; the website's own data practices remain governed by its privacy policy. A link to the external ratings guide opens Google Docs only when the user explicitly selects that link.

## Permissions

The extension is limited to:

- `https://daggerheart.su/*`
- `https://ru.daggerheart.su/*`

This site access is necessary to read and change card presentation on those pages. No broad all-sites access, browsing-history access, tab access, background service, or privileged Chrome storage permission is requested.

## Changes and contact

Material changes to this policy will be documented in the repository and reflected in the Chrome Web Store listing before release. Questions and privacy requests can be submitted through the project's public issue tracker: https://github.com/artex-x/daggerheart-su-companion/issues
