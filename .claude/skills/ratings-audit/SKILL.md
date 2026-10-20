---
name: ratings-audit
description: Audit the userscript ratings and bilingual comments against the current Borfknuckles player's guide and the live daggerheart.su card text. Use when the guide was updated, when asked to check ratings, stars, comments or the Russian translation, to sync with the Google Doc, or before a ratings release.
---

# Ratings audit

This skill checks the `ratings` object in `daggerheart-su-companion.user.js` against two sources: the Borfknuckles guide (`GUIDE_URL` in the userscript) and the card catalogs on `en.daggerheart.su` and `ru.daggerheart.su`. It produces a report and a list of proposed text replacements. It does not edit the userscript until the user approves the findings.

## Source precedence

1. The guide decides the star values and the opinion in each comment.
2. The site card text decides the mechanics: costs, ranges, dice, uses per rest.
3. The site terminology page (`.audit/terms.txt`) and the site card titles decide the Russian terms and names.
4. The existing comments are never a source for terminology.

## Procedure

1. Download the sources and run the mechanical comparison:

   ```bash
   node scripts/audit/ratings-audit.mjs all
   ```

   Expected result: `.audit/report.md`, `.audit/comments.json`, and the site and guide copies in `.audit/`. The folder is ignored by Git.

2. Read `.audit/report.md` and classify each line:

   | Report section | Usual cause | Action |
   |---|---|---|
   | Star differences | The guide changed a rating | Update `stars`, then check that the comment still agrees |
   | Ancestry feature differences | The guide changed a feature rating | Update the feature `stars` |
   | Subclass stage differences | The guide changed a stage rating | Update the stage `stars` |
   | Script entries without a guide star rating | Classes and transformations are rated in prose only | Report to the user; do not invent values |
   | Guide ratings missing from the script | A new card in the guide, or a parser miss | Add a rating, or add the spelling to `GUIDE_NAME_FIXES` |
   | Dead rating keys | The site uses another slug | Add a `SLUG_ALIASES` entry |
   | Site cards without a rating | A new site card | Rate it only if the guide rates it |

   Confirm each parser result against the guide line it cites. The parser reads prose, so a wrong match is possible.

3. Review the comment text. Split `.audit/comments.json` into slices of about 120 records and run one `ratings-comment-auditor` agent per slice in parallel. Give each agent its index range and an output file `.audit/findings-<n>.json`.

4. Merge the findings:

   ```bash
   node scripts/audit/merge-findings.mjs
   ```

   Expected result: `.audit/findings.md` and `.audit/findings.json`, sorted by severity. Read every high and medium finding against the guide line and the site text before you accept it. Reject a finding that only restates a preference.

5. Present the report to the user: star changes, slug fixes, comment fixes grouped by severity, and open questions. Wait for approval.

6. Apply the approved changes to the userscript:
   - Replace text with exact `current` to `proposed` substitutions.
   - Increase `@version` and add a `CHANGELOG.md` entry.
   - Update the expectations in `scripts/validate.ps1` when an alias or a checked rating changes.
   - Run `scripts/validate.ps1`. It also runs `scripts/check-ratings.mjs`, the offline structure check.
   - Run `node scripts/audit/ratings-audit.mjs verify`. Expected result: `Verification passed`. It fails on a star difference, a dead key, a stale alias, an unrated site card or a quoted Russian name that the site does not use.

## Automatic checks

- `scripts/validate.ps1` (every push and pull request): structure of the ratings data, star range, empty or mixed-script comments, alias targets.
- `.github/workflows/site-sync.yml` (every Monday and on demand): runs `verify` against the live site and the guide, and uploads `.audit/report.md`. A failure means the site or the guide changed; start this procedure.

## Known decisions

- The guide rates classes, transformations and Syndicate in prose or with `(???)`. The stars for these entries are editorial values of this project, not guide values.
- The errata renamed Swift Step to Serenity. The site keeps the slug and title Swift Step, so the rating key is `swift-step`. Rating keys always follow the live site slug, never the guide name.
- The lists `EDITORIAL_RATINGS`, `EXPECTED_UNRATED` and `QUOTE_ALLOWLIST` in `ratings-audit.mjs` hold the accepted exceptions. Add an entry only after the user agrees.
- The guide writes `Inferis`, `Chain Lighting` and `Bone Touched`; the parser maps these spellings to the site slugs.
- The scale is 0 to 5. The guide uses 0 to 4 stars, with one explicit 5 (School of Knowledge Foundation).

## Russian terminology rules

Take every term from `.audit/terms.txt` and every card name from `.audit/cards-ru.json`. The rules below catch the frequent errors:

| EN | RU |
|---|---|
| Very Close / Close | Близко / Средне (not Близко for Close) |
| Hit Point | Рана; Hit Point slot = ячейка Раны |
| clear / mark | очистить / отметить (not снять, not восстановить) |
| Major / Severe damage | Ощутимый / Тяжелый урон |
| Tier | Ранг (Level = Уровень) |
| Spotlight | Активация |
| Tag Team Roll | Командный Бросок |
| Downtime, Downtime Move | Отдых, Ход Отдыха |
| Loadout / Vault | Рука / Хранилище |
