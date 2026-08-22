# Releasing the userscript

The public `main` branch is the distribution channel. Tampermonkey and Violentmonkey install and update directly from the root `.user.js` file.

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
4. Open the [raw install URL](https://raw.githubusercontent.com/artex-x/daggerheart-su-companion/main/daggerheart-su-companion.user.js) in a browser with Tampermonkey or Violentmonkey.
5. Confirm the manager shows the expected version and only the three Daggerheart.su matches and three storage grants.
6. Install/update and repeat a short ratings plus print-workspace smoke test.
7. Optionally create a GitHub Release named `v<version>` and attach `dist/release-<version>/daggerheart-su-companion.user.js` plus `SHA256SUMS.txt`.

## Automatic updates

Both `@updateURL` and `@downloadURL` point to the raw file on `main`. Every distributed change must increase `@version`; otherwise userscript managers will not consider it a newer release.

The repository must remain public, the installable filename must remain stable, and the metadata block must remain at the first byte of the file.

## Rollback

Do not lower `@version`. Revert the faulty code, increase the patch version again, validate, and push the corrective release. Userscript managers will then receive the correction through the normal update flow.
