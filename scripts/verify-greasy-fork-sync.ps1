[CmdletBinding()]
param(
    [ValidateRange(0, 900)]
    [int]$TimeoutSeconds = 240,

    [ValidateRange(1, 60)]
    [int]$PollIntervalSeconds = 10
)

$ErrorActionPreference = 'Stop'
$repoRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$scriptPath = Join-Path $repoRoot 'daggerheart-su-companion.user.js'
$apiUrl = 'https://api.greasyfork.org/en/scripts/591859-daggerheart-companion-ratings-class-cards-print.json'

$source = Get-Content -LiteralPath $scriptPath -Raw -Encoding UTF8
$versionMatch = [System.Text.RegularExpressions.Regex]::Match(
    $source,
    '(?m)^//\s+@version\s+(?<version>\d+(?:\.\d+){1,3})\s*$'
)
if (-not $versionMatch.Success) {
    throw 'Could not read @version from the userscript.'
}
$expectedVersion = $versionMatch.Groups['version'].Value
$deadline = [DateTime]::UtcNow.AddSeconds($TimeoutSeconds)

do {
    $listing = Invoke-RestMethod -Method Get -Uri $apiUrl -Headers @{ Accept = 'application/json' }
    $publishedVersion = [string]$listing.version
    if ($publishedVersion -eq $expectedVersion) {
        Write-Output "Greasy Fork synchronization verified: version $publishedVersion."
        exit 0
    }

    if ([DateTime]::UtcNow -ge $deadline) {
        break
    }
    Write-Output "Waiting for Greasy Fork: expected $expectedVersion, currently $publishedVersion."
    Start-Sleep -Seconds $PollIntervalSeconds
} while ($true)

throw "Greasy Fork did not publish version $expectedVersion within $TimeoutSeconds seconds; current version is $publishedVersion. Check source sync and the GitHub webhook delivery."
