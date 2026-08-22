# Userscript release test checklist

Test the root `daggerheart-su-companion.user.js`, not a stale copy. Keep browser developer tools open for errors and ensure only one Daggerheart Companion userscript is enabled.

## Managers and browsers

- [ ] `scripts/validate.ps1` passes.
- [ ] The metadata install page shows the expected version, three site matches, and three `GM_*` grants.
- [ ] Tampermonkey installs and runs the script in one Chromium browser.
- [ ] Violentmonkey installs and runs the script in one Chromium browser.
- [ ] Firefox with Tampermonkey or Violentmonkey is tested for browser-sensitive changes.
- [ ] The userscript does not run on unrelated sites.
- [ ] Reloading a page does not duplicate controls.

## Ratings and class cards

- [ ] `scripts/audit-dread.ps1` confirms that all live English and Russian Dread cards resolve to ratings.
- [ ] Ratings, filters, and popovers work in English and Russian.
- [ ] Unsupported catalogs do not show a rating filter or print controls.
- [ ] Class cards load their feature text and keep list formatting.
- [ ] Underlined terms in class features are real links and win pointer hit-testing over the card-level link.
- [ ] Long content remains readable within the fixed card height.

## Queue and review workspace

- [ ] Adding/removing cards updates every open Daggerheart.su tab.
- [ ] The queue survives page reload through userscript-manager storage.
- [ ] The review workspace uses the normal card presentation, not print-only class normalization.
- [ ] Review cards contain no print-only usage markers.
- [ ] Internal rule links in review cards show an unclipped tooltip on hover and keyboard focus, then navigate on click.
- [ ] Reordering, deletion, and mixed ancestry work.
- [ ] Dragging within the top or bottom activation zone scrolls continuously without requiring the pointer to touch the viewport edge.

## Print and PDF

- [ ] The hidden print tree receives usage/recharge markers and class print normalization.
- [ ] Standalone limits such as `до вашего следующего отдыха`, `до конца её следующего отдыха`, and `until your next rest` are underlined across nested links.
- [ ] Ratings and userscript controls are absent from print cells.
- [ ] Nine cards produce one A4 page without a blank second page.
- [ ] Fewer cards start at the top of the sheet.
- [ ] A saved PDF matches browser print preview and remains readable.

## Update flow

- [ ] After pushing a higher `@version`, a manager's manual update check detects it.
- [ ] Updating preserves the local queue.
- [ ] Only one enabled script with the preserved name/namespace remains.
