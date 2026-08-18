# Release test checklist

Test the exact source state that will be packaged. Disable the Tampermonkey version first and keep Chrome DevTools open for errors.

## Installation and scope

- [ ] `scripts/validate.ps1` passes.
- [ ] The repository root loads through `chrome://extensions` without warnings.
- [ ] The extension runs on `https://daggerheart.su/`.
- [ ] The extension runs on `https://ru.daggerheart.su/`.
- [ ] It does not run on unrelated sites or unsupported Daggerheart pages such as adversaries, environments, settings, rules, equipment, and beast forms where controls are intentionally absent.
- [ ] Reloading the extension and refreshing the page does not duplicate controls.

## Ratings and filtering

- [ ] Rating controls are aligned consistently and do not cover domain labels or Stress costs.
- [ ] Popovers remain visible outside card bounds and close predictably.
- [ ] English and Russian comments match the current card and use site terminology.
- [ ] Rating filters appear only in supported catalogs.
- [ ] Navigating to an unsupported catalog does not hide all cards.
- [ ] Ancestry nested-feature matches explain why the parent card matched.
- [ ] Subclass filtering uses the subclass and class-level rating, not individual stage features.

## Card layouts

- [ ] Class cards use the intended framed image and feature formatting.
- [ ] Long class and ancestry text fits the fixed card height without truncation.
- [ ] Embedded lists and links keep their formatting.
- [ ] English and Russian layouts remain readable at the normal card size.

## Selection and print workspace

- [ ] Printable cards can be added from every intended page.
- [ ] Non-printable page types never show an add-to-print button.
- [ ] The workspace shows actual cards in a three-column grid.
- [ ] Drag-and-drop insertion indicators clearly show left/right or before/after placement.
- [ ] Cards can be reordered and removed without losing other selections.
- [ ] Two ancestry cards can be merged, renamed, and rendered with both chosen feature texts.
- [ ] The mixed-ancestry default name is neutral in both languages.
- [ ] Existing selections survive a normal page refresh.

## Print preview and PDF

- [ ] Nine cards produce exactly one A4 page, not a blank second page.
- [ ] Six or fewer cards start at the top of the page and leave empty slots below.
- [ ] Ratings, add buttons, drag controls, and screen-only class styles do not print.
- [ ] Cards remain visually distinct and readable in a 3×3 layout.
- [ ] Class cards use the same print treatment as comparable card types.
- [ ] Usage/recharge phrases are underlined, including phrases that begin or end a sentence.
- [ ] The browser print preview and a saved PDF match.

## Package smoke test

- [ ] Run `scripts/build.ps1`.
- [ ] Extract the generated ZIP into a new folder.
- [ ] Confirm `manifest.json` is at the extracted root.
- [ ] Load that extracted folder as an unpacked extension.
- [ ] Repeat one ratings/filter flow and one nine-card PDF flow.
