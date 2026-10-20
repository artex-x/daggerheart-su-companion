[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$repoRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$scriptPath = Join-Path $repoRoot 'daggerheart-su-companion.user.js'

if (-not (Test-Path -LiteralPath $scriptPath -PathType Leaf)) {
    throw "Installable userscript is missing: $scriptPath"
}

$requiredLegalFiles = @('LICENSE', 'LICENSE-SCOPE.md', 'THIRD_PARTY_NOTICES.md')
foreach ($fileName in $requiredLegalFiles) {
    if (-not (Test-Path -LiteralPath (Join-Path $repoRoot $fileName) -PathType Leaf)) {
        throw "Required license file is missing: $fileName"
    }
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
}
foreach ($entry in $requiredSingleValues.GetEnumerator()) {
    $values = @(Get-MetadataValues $entry.Key)
    if ($values.Count -ne 1 -or $values[0] -ne $entry.Value) {
        throw "Metadata @$($entry.Key) must equal: $($entry.Value)"
    }
}

foreach ($greasyForkManagedKey in @('downloadURL', 'updateURL', 'installURL')) {
    if (@(Get-MetadataValues $greasyForkManagedKey).Count -gt 0) {
        throw "Metadata @$greasyForkManagedKey must be omitted; Greasy Fork manages installation and update URLs when publishing."
    }
}

$versionValues = @(Get-MetadataValues 'version')
if ($versionValues.Count -ne 1 -or $versionValues[0] -notmatch '^\d+(\.\d+){1,3}$') {
    throw 'Metadata @version must contain one numeric dotted version.'
}
if ($metadata -notmatch '(?m)^//\s+@noframes\s*$') {
    throw 'Metadata must include @noframes.'
}

$expectedMatches = @('https://daggerheart.su/*', 'https://en.daggerheart.su/*', 'https://ru.daggerheart.su/*')
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

$expectedDreadRatings = @(
    'blighting-strike', 'voice-of-dread', 'umbral-veil', 'hideous-retribution',
    'siphon-essence', 'terrify', 'shared-trauma', 'chains-of-affliction',
    'summon-horror', 'spectral-mist', 'dire-strike', 'darkfire', 'jump-scare',
    'dread-touched', 'wall-of-hunger', 'dark-army', 'eldritch-flesh',
    'damnation', 'savor-the-anguish', 'avatar-of-terror', 'invoke-torment'
)
foreach ($slug in $expectedDreadRatings) {
    $escapedSlug = [System.Text.RegularExpressions.Regex]::Escape($slug)
    if ($source -notmatch ('(?m)^        "' + $escapedSlug + '": \{\r?$')) {
        throw "Missing canonical Dread rating: $slug"
    }
}

$expectedCurrentRatings = [ordered]@{
    'summon-horror' = 4
    'darkfire' = 4
    'ferocity' = 0
    'swift-step' = 3
}
foreach ($rating in $expectedCurrentRatings.GetEnumerator()) {
    $escapedSlug = [System.Text.RegularExpressions.Regex]::Escape($rating.Key)
    $pattern = '(?m)^        "' + $escapedSlug + '": \{\r?\n            "stars": ' + $rating.Value + ',?\r?$'
    if ($source -notmatch $pattern) {
        throw "Expected current rating $($rating.Key)=$($rating.Value) was not found."
    }
}
if ($source -match '(?m)^\s+"(?:special|filterStars)":' -or
    $source -match '\bmeta\.special\b' -or
    $source -match '\b(?:problemRating|specialRating)\b') {
    throw 'Obsolete special-rating behavior is present.'
}

$expectedSlugAliases = [ordered]@{
    'fighter' = 'brawler'
    'withering-affliction' = 'chains-of-affliction'
    'nether-flames' = 'darkfire'
    'wailing-leap' = 'jump-scare'
    'avatar-of-malice' = 'avatar-of-terror'
}
foreach ($alias in $expectedSlugAliases.GetEnumerator()) {
    $mapping = '"' + $alias.Key + '": "' + $alias.Value + '"'
    if (-not $source.Contains($mapping)) {
        throw "Missing slug alias: $mapping"
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
    & $node.Source (Join-Path $PSScriptRoot 'check-ratings.mjs') $scriptPath
    if ($LASTEXITCODE -ne 0) {
        throw 'Ratings structure validation failed.'
    }
} else {
    Write-Warning 'Node.js was not found; JavaScript syntax validation was skipped.'
}

Write-Output "Validation passed for Daggerheart.su Companion userscript $($versionValues[0])."
