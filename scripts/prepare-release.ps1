[CmdletBinding()]
param(
    [ValidatePattern('^\d+(\.\d+){0,3}$')]
    [string]$Version
)

$ErrorActionPreference = 'Stop'
$repoRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$manifestPath = Join-Path $repoRoot 'manifest.json'
$utf8 = [System.Text.UTF8Encoding]::new($false)

if ($Version) {
    $manifestText = [System.IO.File]::ReadAllText($manifestPath, $utf8)
    $manifest = $manifestText | ConvertFrom-Json
    $currentVersion = [string]$manifest.version
    if ($currentVersion -ne $Version) {
        $escapedCurrent = [System.Text.RegularExpressions.Regex]::Escape($currentVersion)
        $pattern = '("version"\s*:\s*")' + $escapedCurrent + '("\s*,)'
        $updated = [System.Text.RegularExpressions.Regex]::Replace($manifestText, $pattern, '${1}' + $Version + '${2}', 1)
        if ($updated -eq $manifestText) {
            throw 'Could not update the version field in manifest.json.'
        }
        [System.IO.File]::WriteAllText($manifestPath, $updated, $utf8)
        Write-Output "Updated manifest version: $currentVersion -> $Version"
    }
}

& (Join-Path $PSScriptRoot 'build.ps1')

$manifest = Get-Content -LiteralPath $manifestPath -Raw -Encoding UTF8 | ConvertFrom-Json
$artifactPath = Join-Path $repoRoot "dist\daggerheart-su-companion-$($manifest.version).zip"
if (-not (Test-Path -LiteralPath $artifactPath -PathType Leaf)) {
    throw "Expected extension artifact is missing: $artifactPath"
}

$releaseDirectory = Join-Path $repoRoot "dist\release-$($manifest.version)"
[System.IO.Directory]::CreateDirectory($releaseDirectory) | Out-Null

$releaseArtifact = Join-Path $releaseDirectory ([System.IO.Path]::GetFileName($artifactPath))
Copy-Item -LiteralPath $artifactPath -Destination $releaseArtifact -Force
Copy-Item -LiteralPath (Join-Path $repoRoot 'PRIVACY.md') -Destination (Join-Path $releaseDirectory 'PRIVACY.md') -Force
Copy-Item -LiteralPath (Join-Path $repoRoot 'CHANGELOG.md') -Destination (Join-Path $releaseDirectory 'CHANGELOG.md') -Force
Copy-Item -LiteralPath (Join-Path $repoRoot 'docs\STORE_LISTING.md') -Destination (Join-Path $releaseDirectory 'STORE_LISTING.md') -Force
Copy-Item -LiteralPath (Join-Path $repoRoot 'docs\TESTING.md') -Destination (Join-Path $releaseDirectory 'TESTING.md') -Force

$hash = (Get-FileHash -LiteralPath $releaseArtifact -Algorithm SHA256).Hash.ToLowerInvariant()
[System.IO.File]::WriteAllText(
    (Join-Path $releaseDirectory 'SHA256SUMS.txt'),
    "$hash  $([System.IO.Path]::GetFileName($releaseArtifact))`r`n",
    $utf8
)

$releaseInfo = [ordered]@{
    name = 'Daggerheart.su Companion'
    version = [string]$manifest.version
    artifact = [System.IO.Path]::GetFileName($releaseArtifact)
    sha256 = $hash
    prepared_at_utc = [DateTime]::UtcNow.ToString('o')
    repository = 'https://github.com/artex-x/daggerheart-su-companion'
} | ConvertTo-Json
[System.IO.File]::WriteAllText((Join-Path $releaseDirectory 'release-info.json'), $releaseInfo + "`r`n", $utf8)

$nextSteps = @"
Daggerheart.su Companion $($manifest.version) is ready to upload.

1. Smoke-test the ZIP from this folder in chrome://extensions.
2. Open https://chrome.google.com/webstore/devconsole/.
3. Upload $([System.IO.Path]::GetFileName($releaseArtifact)).
4. Use STORE_LISTING.md and the hosted PRIVACY.md when completing the dashboard.
5. Submit for review.

SHA-256: $hash
"@
[System.IO.File]::WriteAllText((Join-Path $releaseDirectory 'NEXT_STEPS.txt'), $nextSteps.Trim() + "`r`n", $utf8)

Write-Output "Release kit: $releaseDirectory"
Write-Output "Upload ZIP: $releaseArtifact"
Write-Output "SHA256: $hash"
