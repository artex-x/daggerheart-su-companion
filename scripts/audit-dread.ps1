[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$repoRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$scriptPath = Join-Path $repoRoot 'daggerheart-su-companion.user.js'
$source = Get-Content -LiteralPath $scriptPath -Raw -Encoding UTF8

$ratingSlugs = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::Ordinal)
[System.Text.RegularExpressions.Regex]::Matches(
    $source,
    '(?m)^        "(?<slug>[^"]+)": \{\r?$'
) | ForEach-Object { [void]$ratingSlugs.Add($_.Groups['slug'].Value) }

$aliasStart = $source.IndexOf('const SLUG_ALIASES = Object.freeze({', [System.StringComparison]::Ordinal)
$aliasEnd = if ($aliasStart -ge 0) { $source.IndexOf('});', $aliasStart, [System.StringComparison]::Ordinal) } else { -1 }
if ($aliasStart -lt 0 -or $aliasEnd -lt 0) {
    throw 'SLUG_ALIASES block is missing or malformed.'
}
$aliasBlock = $source.Substring($aliasStart, $aliasEnd - $aliasStart)
$aliases = @{}
[System.Text.RegularExpressions.Regex]::Matches(
    $aliasBlock,
    '"(?<old>[^"]+)":\s*"(?<canonical>[^"]+)"'
) | ForEach-Object {
    $aliases[$_.Groups['old'].Value] = $_.Groups['canonical'].Value
}

$catalogs = [ordered]@{
    en = 'https://en.daggerheart.su/domain-card'
    ru = 'https://ru.daggerheart.su/domain-card'
}
$expectedCount = 21
$results = @()

foreach ($catalog in $catalogs.GetEnumerator()) {
    $html = (Invoke-WebRequest -UseBasicParsing -Uri $catalog.Value).Content
    $cardTags = [System.Text.RegularExpressions.Regex]::Matches(
        $html,
        '<div[^>]*class="[^"]*\bcard domain_card playtest-dread\b[^"]*"[^>]*>'
    )
    if ($cardTags.Count -ne $expectedCount) {
        throw "$($catalog.Key) catalog exposes $($cardTags.Count) Dread cards; expected $expectedCount. Re-audit the live catalogue."
    }

    foreach ($tag in $cardTags) {
        $slugMatch = [System.Text.RegularExpressions.Regex]::Match($tag.Value, '\bid="(?<slug>[^"]+)"')
        if (-not $slugMatch.Success) {
            throw "Dread card without an id on $($catalog.Value): $($tag.Value)"
        }
        $siteSlug = $slugMatch.Groups['slug'].Value
        $canonicalSlug = if ($aliases.ContainsKey($siteSlug)) { $aliases[$siteSlug] } else { $siteSlug }
        $hasRating = $ratingSlugs.Contains($canonicalSlug)
        $results += [pscustomobject]@{
            Language = $catalog.Key
            SiteSlug = $siteSlug
            CanonicalSlug = $canonicalSlug
            HasRating = $hasRating
        }
    }
}

$missing = @($results | Where-Object { -not $_.HasRating })
if ($missing.Count -gt 0) {
    $details = ($missing | ForEach-Object { "$($_.Language):$($_.SiteSlug) -> $($_.CanonicalSlug)" }) -join ', '
    throw "Dread cards without ratings: $details"
}

$aliasHits = @($results | Where-Object { $_.SiteSlug -ne $_.CanonicalSlug })
Write-Output "Dread audit passed: $($results.Count) live cards checked across English and Russian; all resolve to ratings."
Write-Output "Stale site slugs resolved through aliases: $((@($aliasHits | Select-Object -ExpandProperty SiteSlug -Unique) | Sort-Object) -join ', ')."
