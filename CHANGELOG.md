# Changelog

All notable changes to this project are documented here.

## 7.0.16 - 2026-10-20

- Restored the rating for Swift Step, which the guide rates under its errata name Serenity. The site still uses the `swift-step` slug.
- Corrected Russian card and feature names to match ru.daggerheart.su, for example «Касание милости», «Метка Следопыта», «Милость», «Сглаз», «Воющее Безумие» and «Облако тьмы».
- Fixed comments that contradicted the card text or the guide, including Hedge, Vampire, Vengeance, Firbolg, Underborne, Wildborne and Book of Vagras.
- Aligned Russian terminology with the site glossary: «очистить» for Stress and Hit Points, «Далекая дистанция», «Рука» and «Приспешник».
- Added the ratings audit tool, a live-site verification workflow and an offline ratings structure check.

## 7.0.15 — 2026-09-01

- Let text-heavy class cards use a little more vertical space before reducing their font size.
- Kept short class cards at their existing image/text balance by returning unused text space to the artwork.
- Refit class typography after late font and native-frame layout changes to prevent edge-case overflow.

## 7.0.14 — 2026-09-01

- Made compact class cards move their native white text panel down when the fitted rules text is shorter, revealing more artwork like native subclass cards.
- Preserved a native-sized minimum text panel and reset the adaptive screen inset for print layouts.

## 7.0.13 — 2026-09-01

- Capped compact class-card body text at 12.5px to match native subclass typography while retaining fit-to-card shrinking for longer classes.
- Kept the site's native class image height, which already matches subclass cards, instead of introducing a separate image-size override.

## 7.0.12 — 2026-09-01

- Removed the four level-to-tier reference lines from Sneak Attack on the compact Rogue card while preserving them on the full class page.

## 7.0.11 — 2026-08-30

- Kept rating comments focused on current card mechanics instead of rule-revision history.
- Clarified how Duneborne's Downtime Move reroll can improve Hit Point or Stress recovery.

## 7.0.10 — 2026-08-30

- Re-audited ratings and bilingual commentary against the updated author guide and Hope & Fear errata.
- Replaced Summon Horror's obsolete emoji state with its post-errata 4/5 rating and removed the dead special-rating UI branch.
- Updated changed ratings, corrected Daggerheart terminology, and removed the unsupported Swift Step rating.

## 7.0.9 — 2026-08-22

- Replaced the redundant 3 × 3 size recommendation with actionable A4 print-dialog settings in Russian and English.

## 7.0.8 — 2026-08-22

- Marked standalone next-rest limits such as “до вашего следующего отдыха” and “until your next rest” in printed cards.
- Covered possessive, “до конца”, and English `before`/`at`/`on` next-rest variants found across live printable catalogs.

## 7.0.7 — 2026-08-22

- Restored hover and keyboard-focus rule tooltips for links inside cards reconstructed in the print workspace.
- Added smooth drag auto-scrolling with substantially larger activation zones near the top and bottom of the viewport.

## 7.0.6 — 2026-08-22

- Matched spacing between class features to the natural paragraph rhythm of multi-feature domain and grimoire cards.
- Stopped distributing unused card height between class features, preventing oversized and inconsistent gaps.

## 7.0.5 — 2026-08-22

- Matched compact class body typography to native card text and restored hover tooltips plus direct navigation for rule links.
- Added automatic Greasy Fork deployment documentation, main-branch version enforcement, and post-push publication verification.

## 7.0.4 — 2026-08-22

- Added the 16 missing Dread ratings and bilingual source-derived commentary, completing all 21 cards from The Void v1.5.
- Added aliases for four stale Dread catalogue slugs and direct support for `en.daggerheart.su`.
- Canonicalized the renamed Brawler class while retaining compatibility with the site's legacy `playtest-fighter` slug.
- Preserved the guide's special 😬 rating for Summon Horror instead of inventing a displayed star score.
- Clarified that MIT covers only original code and documentation, and added DPCGL/playtest and ratings-guide license notices.
- Aligned installation and automatic updates with the existing Greasy Fork listing, leaving GitHub as the canonical source and issue tracker.

## 7.0.3 — 2026-08-22

- Returned the repository to a free cross-browser userscript distribution.
- Used the user-provided 7.0.2 script as the source of improved ratings comments.
- Moved the installable `.user.js` to the repository root for one-click GitHub installation.
- Added GitHub-based automatic update, homepage, and support metadata.
- Kept print-only usage markers and class normalization out of the on-screen review workspace.
- Restored navigable same-origin rules links inside enhanced class cards.
- Replaced Manifest V3 packaging with userscript validation and release scripts.

## 7.0.2

- Revised ratings comments and translations for better clarity and Daggerheart context.

## 7.0.0 — 2026-08-18

- Added ratings, filters, redesigned class cards, a shared print queue, 3×3 A4 output, and mixed-ancestry cards.
