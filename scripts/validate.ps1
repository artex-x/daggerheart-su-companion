[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$repoRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$manifestPath = Join-Path $repoRoot 'manifest.json'
$contentScriptPath = Join-Path $repoRoot 'src\content-script.js'

foreach ($requiredPath in @(
    $manifestPath,
    $contentScriptPath,
    (Join-Path $repoRoot '_locales\en\messages.json'),
    (Join-Path $repoRoot '_locales\ru\messages.json')
)) {
    if (-not (Test-Path -LiteralPath $requiredPath -PathType Leaf)) {
        throw "Required file is missing: $requiredPath"
    }
}

$manifest = Get-Content -LiteralPath $manifestPath -Raw -Encoding UTF8 | ConvertFrom-Json
if ($manifest.manifest_version -ne 3) {
    throw 'manifest_version must be 3.'
}
if ($manifest.version -notmatch '^\d+(\.\d+){0,3}$') {
    throw "Invalid Chrome extension version: $($manifest.version)"
}
if ($manifest.background -or $manifest.permissions -or $manifest.host_permissions) {
    throw 'This extension should not declare background, permissions, or host_permissions entries.'
}
if ($manifest.default_locale -ne 'en') {
    throw 'default_locale must be en.'
}

$localizedManifestFields = @('name', 'short_name', 'description')
$localeMessages = @{}
foreach ($locale in @('en', 'ru')) {
    $messagesPath = Join-Path $repoRoot "_locales\$locale\messages.json"
    $localeMessages[$locale] = Get-Content -LiteralPath $messagesPath -Raw -Encoding UTF8 | ConvertFrom-Json
}
foreach ($field in $localizedManifestFields) {
    $placeholder = [string]$manifest.$field
    if ($placeholder -notmatch '^__MSG_([A-Za-z0-9_]+)__$') {
        throw "Manifest field $field must use a localization placeholder."
    }
    $messageKey = $Matches[1]
    foreach ($locale in @('en', 'ru')) {
        if ($messageKey -notin $localeMessages[$locale].PSObject.Properties.Name) {
            throw "Locale $locale is missing message key $messageKey."
        }
        $message = [string]$localeMessages[$locale].$messageKey.message
        if ([string]::IsNullOrWhiteSpace($message)) {
            throw "Locale $locale has an empty message for $messageKey."
        }
        if ($field -eq 'description' -and $message.Length -gt 132) {
            throw "Locale $locale description exceeds Chrome's 132-character limit."
        }
        if ($field -eq 'short_name' -and $message.Length -gt 12) {
            throw "Locale $locale short name exceeds 12 characters."
        }
    }
}

$expectedMatches = @('https://daggerheart.su/*', 'https://ru.daggerheart.su/*')
$actualMatches = @($manifest.content_scripts[0].matches)
if ($actualMatches.Count -ne $expectedMatches.Count -or @($actualMatches | Where-Object { $_ -notin $expectedMatches }).Count -gt 0) {
    throw "Content-script matches must be limited to: $($expectedMatches -join ', ')"
}
if ($manifest.content_scripts.Count -ne 1 -or $manifest.content_scripts[0].run_at -ne 'document_idle') {
    throw 'Exactly one document_idle content script must be declared.'
}

$iconSizes = @(16, 32, 48, 128)
Add-Type -AssemblyName System.Drawing
foreach ($size in $iconSizes) {
    $iconPath = Join-Path $repoRoot "icons\icon-$size.png"
    if (-not (Test-Path -LiteralPath $iconPath -PathType Leaf)) {
        throw "Required icon is missing: $iconPath"
    }
    $image = [System.Drawing.Image]::FromFile($iconPath)
    try {
        if ($image.Width -ne $size -or $image.Height -ne $size) {
            throw "Icon icon-$size.png must be ${size}x${size}px."
        }
    } finally {
        $image.Dispose()
    }
}

$source = Get-Content -LiteralPath $contentScriptPath -Raw -Encoding UTF8
$forbiddenPatterns = @(
    @{ Name = 'userscript metadata'; Pattern = '==UserScript==' },
    @{ Name = 'Tampermonkey API'; Pattern = '\bGM_[A-Za-z]+' },
    @{ Name = 'dynamic evaluation'; Pattern = '\beval\s*\(|\bnew\s+Function\b' },
    @{ Name = 'all-sites access'; Pattern = '<all_urls>' }
)
foreach ($entry in $forbiddenPatterns) {
    if ($source -match $entry.Pattern) {
        throw "Forbidden $($entry.Name) found in content script."
    }
}

$node = Get-Command node -ErrorAction SilentlyContinue
if ($node) {
    & $node.Source --check $contentScriptPath
    if ($LASTEXITCODE -ne 0) {
        throw 'JavaScript syntax validation failed.'
    }
} else {
    Write-Warning 'Node.js was not found; JavaScript syntax validation was skipped.'
}

Write-Output "Validation passed for Daggerheart.su Companion $($manifest.version)."
