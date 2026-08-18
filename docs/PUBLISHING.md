# Publishing Daggerheart.su Companion

This guide covers local testing, packaging, and submission to the Chrome Web Store.

## 1. Complete the pre-release checks

Before publishing publicly:

1. Confirm permission to redistribute or adapt the ratings and commentary described in `THIRD_PARTY_NOTICES.md`.
2. Confirm that the public issue tracker is an acceptable support channel, or replace it with a dedicated support email.
3. Confirm that `https://github.com/artex-x/daggerheart-su-companion/blob/main/PRIVACY.md` is publicly accessible after the first push. GitHub Pages can replace it later if desired.
4. Enter the verified Chrome Web Store publisher support email in the dashboard.
5. Review the current [Chrome Web Store Program Policies](https://developer.chrome.com/docs/webstore/program-policies/policies).

## 2. Test the unpacked extension

Disable the Tampermonkey version first.

```powershell
cd C:\dev\daggerheart-su-companion
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\validate.ps1
```

Then:

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Choose **Load unpacked**.
4. Select `C:\dev\daggerheart-su-companion`.
5. Run every item in `docs/TESTING.md` on both site languages.
6. Check the extension card on `chrome://extensions` for manifest or runtime errors.

Chrome recommends testing an extension locally before submission. See [Prepare your extension](https://developer.chrome.com/docs/webstore/prepare).

## 3. Set the release version

Update the `version` in `manifest.json`. Chrome versions contain one to four dot-separated integers. Every uploaded update must have a greater version than the previously published package.

Also add a matching entry to `CHANGELOG.md`.

## 4. Prepare the release kit

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\prepare-release.ps1
```

To update the manifest version in the same command, add `-Version 7.0.1`. The command creates `dist/release-<version>` containing the upload ZIP, SHA-256 checksum, privacy policy, listing copy, changelog, test checklist, and a short next-steps file. Do not ZIP the repository folder manually: the Web Store requires `manifest.json` at the root of the archive.

For a final smoke test, extract the ZIP to a new folder and load that extracted folder through `chrome://extensions`.

## 5. Prepare the developer account

1. Sign in to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/).
2. Complete developer registration and any fee shown by the dashboard.
3. Enable 2-Step Verification for the publishing account; Chrome Web Store policy requires it.
4. Complete the publisher identity/contact fields requested by Google.

Avoid sharing the publishing account. Use the dashboard's group-publisher features if multiple maintainers need access.

## 6. Create the listing

1. Select **Add new item**.
2. Upload `dist/daggerheart-su-companion-<version>.zip`.
3. Fill in **Store listing** using `docs/STORE_LISTING.md`.
4. Upload screenshots made from the current release; see `assets/store/README.md`.
5. In **Privacy**, declare the extension's single purpose and explain its narrow host access.
6. Add the hosted privacy-policy URL.
7. In **Distribution**, choose Public, Unlisted, or Private and the intended regions. All visibility modes are subject to review.
8. Add test instructions if the dashboard provides that field. The site does not require a test account.

Manifest metadata cannot be corrected in the dashboard; change `manifest.json`, rebuild, and upload a new ZIP if the name, description, icons, or version are wrong.

Official references:

- [Publish in the Chrome Web Store](https://developer.chrome.com/docs/webstore/publish)
- [Privacy tab](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy)
- [Distribution tab](https://developer.chrome.com/docs/webstore/cws-dashboard-distribution)

## 7. Submit and release

Review the dashboard warnings, then select **Submit for review**. Use deferred publishing if you want approval to finish before making the item public.

Do not claim affiliation with Darrington Press or Daggerheart.su. Keep the single-purpose statement, screenshots, permissions explanation, and actual behavior consistent.

## 8. Publish updates

For each update:

1. Pull the release commit and rerun `scripts/validate.ps1`.
2. Increase `manifest.json`'s version.
3. Update `CHANGELOG.md` and repeat `docs/TESTING.md`.
4. Run `scripts/prepare-release.ps1`.
5. Upload the new ZIP to the existing dashboard item.
6. Check the checksum against the CI artifact when releasing from GitHub.

Keep the previous accepted Git tag and ZIP so a known-good source state remains available if a release must be withdrawn.
