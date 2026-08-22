# Security policy

## Supported versions

Security fixes target the latest version of `daggerheart-su-companion.user.js` on the `main` branch.

## Reporting a vulnerability

Use GitHub Private Vulnerability Reporting at https://github.com/artex-x/daggerheart-su-companion/security/advisories/new. Do not publish an exploitable report in a public issue before a fix is available.

Include the affected userscript version, browser, userscript manager and version, reproduction steps, impacted site origin, and whether local print-queue data is exposed or modified.

## Security boundaries

The userscript intentionally has no remote executable dependencies, analytics, account system, or broad site access. Its only privileged APIs are the three local-storage/synchronization `GM_*` grants declared in the metadata block.
