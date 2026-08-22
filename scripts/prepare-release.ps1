[CmdletBinding()]
param(
    [ValidatePattern('^\d+(\.\d+){1,3}$')]
    [string]$Version
)

$ErrorActionPreference = 'Stop'
$repoRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$scriptPath = Join-Path $repoRoot 'daggerheart-su-companion.user.js'
$utf8 = [System.Text.UTF8Encoding]::new($false)

if ($Version) {
    $source = [System.IO.File]::ReadAllText($scriptPath, $utf8)
    $versionMatch = [System.Text.RegularExpressions.Regex]::Match($source, '(?m)^(//\s+@version\s+)(\d+(?:\.\d+){1,3})(\s*)$')
    if (-not $versionMatch.Success) {
        throw 'Could not find a valid @version metadata line.'
    }
    $currentVersion = $versionMatch.Groups[2].Value
    if ($currentVersion -ne $Version) {
        $updated = $source.Substring(0, $versionMatch.Index) +
            $versionMatch.Groups[1].Value + $Version + $versionMatch.Groups[3].Value +
            $source.Substring($versionMatch.Index + $versionMatch.Length)
        [System.IO.File]::WriteAllText($scriptPath, $updated, $utf8)
        Write-Output "Updated userscript version: $currentVersion -> $Version"
    }
}

& (Join-Path $PSScriptRoot 'build.ps1')

$source = Get-Content -LiteralPath $scriptPath -Raw -Encoding UTF8
$versionMatch = [System.Text.RegularExpressions.Regex]::Match($source, '(?m)^//\s+@version\s+(\d+(?:\.\d+){1,3})\s*$')
$currentVersion = $versionMatch.Groups[1].Value
$builtArtifact = Join-Path $repoRoot 'dist\daggerheart-su-companion.user.js'
$releaseDirectory = Join-Path $repoRoot "dist\release-$currentVersion"
[System.IO.Directory]::CreateDirectory($releaseDirectory) | Out-Null

$releaseArtifact = Join-Path $releaseDirectory 'daggerheart-su-companion.user.js'
Copy-Item -LiteralPath $builtArtifact -Destination $releaseArtifact -Force
Copy-Item -LiteralPath (Join-Path $repoRoot 'README.md') -Destination (Join-Path $releaseDirectory 'README.md') -Force
Copy-Item -LiteralPath (Join-Path $repoRoot 'README.ru.md') -Destination (Join-Path $releaseDirectory 'README.ru.md') -Force
Copy-Item -LiteralPath (Join-Path $repoRoot 'PRIVACY.md') -Destination (Join-Path $releaseDirectory 'PRIVACY.md') -Force
Copy-Item -LiteralPath (Join-Path $repoRoot 'CHANGELOG.md') -Destination (Join-Path $releaseDirectory 'CHANGELOG.md') -Force
Copy-Item -LiteralPath (Join-Path $repoRoot 'LICENSE') -Destination (Join-Path $releaseDirectory 'LICENSE') -Force
Copy-Item -LiteralPath (Join-Path $repoRoot 'LICENSE-SCOPE.md') -Destination (Join-Path $releaseDirectory 'LICENSE-SCOPE.md') -Force
Copy-Item -LiteralPath (Join-Path $repoRoot 'THIRD_PARTY_NOTICES.md') -Destination (Join-Path $releaseDirectory 'THIRD_PARTY_NOTICES.md') -Force
Copy-Item -LiteralPath (Join-Path $repoRoot 'docs\RELEASING.md') -Destination (Join-Path $releaseDirectory 'RELEASING.md') -Force
Copy-Item -LiteralPath (Join-Path $repoRoot 'docs\TESTING.md') -Destination (Join-Path $releaseDirectory 'TESTING.md') -Force

$hash = (Get-FileHash -LiteralPath $releaseArtifact -Algorithm SHA256).Hash.ToLowerInvariant()
[System.IO.File]::WriteAllText(
    (Join-Path $releaseDirectory 'SHA256SUMS.txt'),
    "$hash  daggerheart-su-companion.user.js`r`n",
    $utf8
)

$releaseInfo = [ordered]@{
    name = 'Daggerheart.su Companion'
    version = $currentVersion
    artifact = 'daggerheart-su-companion.user.js'
    sha256 = $hash
    install_url = 'https://greasyfork.org/en/scripts/591859-daggerheart-companion-ratings-class-cards-print'
    greasy_fork_update_url = 'https://greasyfork.org/en/scripts/591859/versions/new'
    prepared_at_utc = [DateTime]::UtcNow.ToString('o')
} | ConvertTo-Json
[System.IO.File]::WriteAllText((Join-Path $releaseDirectory 'release-info.json'), $releaseInfo + "`r`n", $utf8)

$nextSteps = @"
Daggerheart.su Companion $currentVersion is ready.

1. Complete the smoke tests in TESTING.md.
2. Commit daggerheart-su-companion.user.js and push main.
3. Update the existing Greasy Fork listing from this .user.js file (or sync it from main):
   https://greasyfork.org/en/scripts/591859/versions/new
4. Verify the public listing shows version ${currentVersion}, then install/update from:
   https://greasyfork.org/en/scripts/591859-daggerheart-companion-ratings-class-cards-print

SHA-256: $hash
"@
[System.IO.File]::WriteAllText((Join-Path $releaseDirectory 'NEXT_STEPS.txt'), $nextSteps.Trim() + "`r`n", $utf8)

Write-Output "Release kit: $releaseDirectory"
Write-Output "Userscript: $releaseArtifact"
Write-Output "SHA256: $hash"
