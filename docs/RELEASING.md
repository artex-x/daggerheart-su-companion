# Releasing the userscript

[Greasy Fork](https://greasyfork.org/en/scripts/591859-daggerheart-companion-ratings-class-cards-print) is the primary distribution and automatic-update channel. The public `main` branch is the canonical source and feeds the existing Greasy Fork listing.

## One-command preparation

From the repository root:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\prepare-release.ps1 -Version 7.0.4
```

The command updates `@version`, validates metadata and JavaScript, and creates `dist/release-<version>` containing the userscript, checksum, test checklist, privacy policy, license and third-party notices, changelog, and next steps.

Omit `-Version` when the correct version is already present.

## Release checklist

1. Review `git diff`, especially the metadata block and ratings/comment changes.
2. Run `scripts/audit-dread.ps1`, then complete `docs/TESTING.md` with the root userscript.
3. Commit the version change and push `main`.
4. Update the existing Greasy Fork listing from the root `daggerheart-su-companion.user.js`. Configure code sync from the [raw GitHub source](https://raw.githubusercontent.com/artex-x/daggerheart-su-companion/main/daggerheart-su-companion.user.js) if it is not already enabled.
5. On Greasy Fork, review the diff and publish the new version. Do not create a second listing.
6. Open the public Greasy Fork page and confirm it shows the expected version.
7. Install/update from Greasy Fork and confirm the manager shows only the three Daggerheart.su matches and three storage grants.
8. Repeat a short ratings plus print-workspace smoke test.
9. Optionally create a GitHub Release named `v<version>` and attach `dist/release-<version>/daggerheart-su-companion.user.js` plus `SHA256SUMS.txt` as source artifacts, not as an alternative installation channel.

## Automatic updates

Greasy Fork rewrites `@updateURL` and `@downloadURL` when it publishes the script. Keep those fields, and `@installURL`, out of the repository source so users do not end up on competing update channels. Every distributed change must increase `@version`; otherwise Greasy Fork and userscript managers will not treat it as a newer release.

The installable filename and Greasy Fork listing must remain stable, and the metadata block must remain at the first byte of the file.

## Rollback

Do not lower `@version`. Revert the faulty code, increase the patch version again, validate, push, and publish the corrective version on the same Greasy Fork listing. Userscript managers will then receive the correction through the normal update flow.
