# Privacy policy

Last updated: 2026-08-22

Daggerheart.su Companion is an unofficial userscript that enhances card catalogs on `daggerheart.su` and `ru.daggerheart.su`.

## Data processed locally

The userscript reads the visible page structure and card content to add ratings and filters, restyle class cards, and prepare user-selected cards for printing. When a class card needs feature text, it may request another page from the same Daggerheart.su origin.

The print queue may contain card HTML, identifiers, ordering, a custom mixed-ancestry name, and selected feature text. The active rating filter is also retained.

## Storage

The print queue is stored by the userscript manager through `GM_getValue` and `GM_setValue`. A site-local storage fallback is used when those APIs are unavailable. Data stays in the user's browser and can be removed from the userscript manager or by clearing Daggerheart.su site data.

## Collection and transmission

The project maintainer does not collect, receive, sell, or share browsing data, card selections, or print-queue contents. The userscript contains no analytics, advertising SDK, telemetry endpoint, account system, or remote executable dependency.

Daggerheart.su and the selected userscript manager have their own data practices. A link to the external ratings guide opens Google Docs only after an explicit user action.

## Site scope and grants

The userscript runs only on `https://daggerheart.su/*` and `https://ru.daggerheart.su/*`. Its grants are limited to `GM_getValue`, `GM_setValue`, and `GM_addValueChangeListener`, which provide local storage and cross-tab queue synchronization.

Questions and privacy requests can be submitted at https://github.com/artex-x/daggerheart-su-companion/issues.
