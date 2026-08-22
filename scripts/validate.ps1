[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$repoRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$scriptPath = Join-Path $repoRoot 'daggerheart-su-companion.user.js'

if (-not (Test-Path -LiteralPath $scriptPath -PathType Leaf)) {
    throw "Installable userscript is missing: $scriptPath"
}

$source = Get-Content -LiteralPath $scriptPath -Raw -Encoding UTF8
if (-not $source.StartsWith('// ==UserScript==')) {
    throw 'The userscript metadata block must start at the first byte of the file.'
}

$metadataEnd = $source.IndexOf('// ==/UserScript==', [System.StringComparison]::Ordinal)
if ($metadataEnd -lt 0) {
    throw 'The userscript metadata block is not closed.'
}
$metadata = $source.Substring(0, $metadataEnd + '// ==/UserScript=='.Length)

function Get-MetadataValues([string]$Key) {
    $escaped = [System.Text.RegularExpressions.Regex]::Escape($Key)
    return @([System.Text.RegularExpressions.Regex]::Matches(
        $metadata,
        '(?m)^//\s+@' + $escaped + '\s+(.+?)\s*$'
    ) | ForEach-Object { $_.Groups[1].Value })
}

$requiredSingleValues = [ordered]@{
    name = 'Daggerheart Companion: ratings, class cards & print'
    namespace = 'https://daggerheart.su/'
    license = 'MIT'
    'run-at' = 'document-idle'
    homepageURL = 'https://github.com/artex-x/daggerheart-su-companion'
    supportURL = 'https://github.com/artex-x/daggerheart-su-companion/issues'
    downloadURL = 'https://raw.githubusercontent.com/artex-x/daggerheart-su-companion/main/daggerheart-su-companion.user.js'
    updateURL = 'https://raw.githubusercontent.com/artex-x/daggerheart-su-companion/main/daggerheart-su-companion.user.js'
}
foreach ($entry in $requiredSingleValues.GetEnumerator()) {
    $values = @(Get-MetadataValues $entry.Key)
    if ($values.Count -ne 1 -or $values[0] -ne $entry.Value) {
        throw "Metadata @$($entry.Key) must equal: $($entry.Value)"
    }
}

$versionValues = @(Get-MetadataValues 'version')
if ($versionValues.Count -ne 1 -or $versionValues[0] -notmatch '^\d+(\.\d+){1,3}$') {
    throw 'Metadata @version must contain one numeric dotted version.'
}
if ($metadata -notmatch '(?m)^//\s+@noframes\s*$') {
    throw 'Metadata must include @noframes.'
}

$expectedMatches = @('https://daggerheart.su/*', 'https://ru.daggerheart.su/*')
$actualMatches = @(Get-MetadataValues 'match')
if ($actualMatches.Count -ne $expectedMatches.Count -or @($actualMatches | Where-Object { $_ -notin $expectedMatches }).Count -gt 0) {
    throw "@match must be limited to: $($expectedMatches -join ', ')"
}

$expectedGrants = @('GM_getValue', 'GM_setValue', 'GM_addValueChangeListener')
$actualGrants = @(Get-MetadataValues 'grant')
if ($actualGrants.Count -ne $expectedGrants.Count -or @($actualGrants | Where-Object { $_ -notin $expectedGrants }).Count -gt 0) {
    throw "@grant must be limited to: $($expectedGrants -join ', ')"
}
foreach ($api in $expectedGrants) {
    if ($source -notmatch ('\b' + [System.Text.RegularExpressions.Regex]::Escape($api) + '\b')) {
        throw "Declared API is not used: $api"
    }
}

$forbiddenPatterns = @(
    @{ Name = 'remote dependency'; Pattern = '(?m)^//\s+@require\b' },
    @{ Name = 'cross-origin permission'; Pattern = '(?m)^//\s+@connect\b' },
    @{ Name = 'dynamic evaluation'; Pattern = '\beval\s*\(|\bnew\s+Function\b' },
    @{ Name = 'browser-extension API'; Pattern = '\b(?:chrome|browser)\.(?:runtime|storage|tabs|scripting)\b' },
    @{ Name = 'all-sites access'; Pattern = '<all_urls>' }
)
foreach ($entry in $forbiddenPatterns) {
    if ($source -match $entry.Pattern) {
        throw "Forbidden $($entry.Name) found in userscript."
    }
}

$node = Get-Command node -ErrorAction SilentlyContinue
if ($node) {
    & $node.Source --check $scriptPath
    if ($LASTEXITCODE -ne 0) {
        throw 'JavaScript syntax validation failed.'
    }
} else {
    Write-Warning 'Node.js was not found; JavaScript syntax validation was skipped.'
}

Write-Output "Validation passed for Daggerheart.su Companion userscript $($versionValues[0])."
