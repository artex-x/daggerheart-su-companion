# Releasing the userscript

[Greasy Fork](https://greasyfork.org/en/scripts/591859-daggerheart-companion-ratings-class-cards-print) is the primary distribution and automatic-update channel. The public `main` branch is the canonical source and feeds the existing Greasy Fork listing.

## One-time automatic deployment setup

1. On the Greasy Fork listing's **Admin** page, set **Sync URL** to:

   ```text
   https://raw.githubusercontent.com/artex-x/daggerheart-su-companion/main/daggerheart-su-companion.user.js
   ```

2. Select **Automatic** synchronization and save.
3. In GitHub, open **Settings → Webhooks → Add webhook** and use:
   - Payload URL: `https://api.greasyfork.org/en/users/1635344-artex-artex/webhook`
   - Content type: `application/json`
   - Secret: the value shown on the signed-in [Greasy Fork webhook page](https://greasyfork.org/en/users/webhook-info)
   - Events: **Just the push event**
   - Active: checked

The webhook secret is a GitHub repository-webhook setting, not an Actions environment variable. GitHub does not substitute `${{ secrets.GREASY_FORK_SECRET }}` or another variable into that field; paste the actual Greasy Fork secret and never commit it.

The webhook fires independently of GitHub Actions. Protect `main` and require the validation workflow before merging if failed validation must prevent a public update. The workflow requires a higher `@version` whenever the userscript changes and waits for the Greasy Fork API to report the pushed version.

The root `daggerheart-su-companion.user.js` is both the source and the published artifact. No build output or release kit is needed.

## Release checklist

1. Increase `@version` for any change to the userscript.
2. Review `git diff`, especially the metadata block and ratings/comment changes.
3. Run `scripts/validate.ps1`.
4. Complete the relevant checks in `docs/TESTING.md` with the root userscript.
5. Commit and push `main`.
6. Confirm the `Validate userscript and verify sync` workflow succeeds.
7. Confirm the public Greasy Fork page shows the expected version, then perform a short installed-script smoke test.

## Automatic updates

Greasy Fork rewrites `@updateURL` and `@downloadURL` when it publishes the script. Keep those fields, and `@installURL`, out of the repository source so users do not end up on competing update channels. Every distributed change must increase `@version`; otherwise Greasy Fork and userscript managers will not treat it as a newer release.

`scripts/assert-version-bump.ps1` enforces that rule for changes pushed to `main`. `scripts/verify-greasy-fork-sync.ps1` polls the public read-only API after validation; failure normally means the one-time sync setting or GitHub webhook delivery needs attention.

The installable filename and Greasy Fork listing must remain stable, and the metadata block must remain at the first byte of the file.

## Rollback

Do not lower `@version`. Revert the faulty code, increase the patch version again, validate, push, and publish the corrective version on the same Greasy Fork listing. Userscript managers will then receive the correction through the normal update flow.
