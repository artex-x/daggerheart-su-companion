[CmdletBinding()]
param(
    [Parameter(Mandatory)]
    [ValidatePattern('^[0-9a-fA-F]{40}$')]
    [string]$BaseSha
)

$ErrorActionPreference = 'Stop'
$repoRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$relativePath = 'daggerheart-su-companion.user.js'
$scriptPath = Join-Path $repoRoot $relativePath

if ($BaseSha -match '^0+$') {
    Write-Output 'Initial branch push; userscript version comparison skipped.'
    exit 0
}

Push-Location $repoRoot
try {
    & git cat-file -e "$BaseSha`^{commit}" 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "Base commit is unavailable: $BaseSha"
    }

    & git diff --quiet $BaseSha HEAD -- $relativePath
    if ($LASTEXITCODE -eq 0) {
        Write-Output 'Userscript is unchanged; no version bump is required.'
        exit 0
    }
    if ($LASTEXITCODE -ne 1) {
        throw 'Could not compare the userscript with the previous revision.'
    }

    $currentSource = Get-Content -LiteralPath $scriptPath -Raw -Encoding UTF8
    $previousSource = (& git show "${BaseSha}:$relativePath" 2>$null) -join "`n"
    if ($LASTEXITCODE -ne 0) {
        throw "Userscript did not exist at base commit $BaseSha."
    }

    function Read-UserscriptVersion([string]$Source, [string]$Label) {
        $match = [System.Text.RegularExpressions.Regex]::Match(
            $Source,
            '(?m)^//\s+@version\s+(?<version>\d+(?:\.\d+){1,3})\s*$'
        )
        if (-not $match.Success) {
            throw "Could not read @version from $Label."
        }
        return [version]$match.Groups['version'].Value
    }

    $currentVersion = Read-UserscriptVersion $currentSource 'the current userscript'
    $previousVersion = Read-UserscriptVersion $previousSource "userscript at $BaseSha"
    if ($currentVersion -le $previousVersion) {
        throw "Userscript changed, but @version did not increase ($previousVersion -> $currentVersion)."
    }

    Write-Output "Userscript version increased: $previousVersion -> $currentVersion"
} finally {
    Pop-Location
}
