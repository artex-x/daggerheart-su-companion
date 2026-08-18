[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$repoRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$distDirectory = Join-Path $repoRoot 'dist'

& (Join-Path $PSScriptRoot 'validate.ps1')

$manifest = Get-Content -LiteralPath (Join-Path $repoRoot 'manifest.json') -Raw -Encoding UTF8 | ConvertFrom-Json
[System.IO.Directory]::CreateDirectory($distDirectory) | Out-Null

$stagingName = '.staging-' + [System.Guid]::NewGuid().ToString('N')
$stagingDirectory = Join-Path $distDirectory $stagingName
[System.IO.Directory]::CreateDirectory($stagingDirectory) | Out-Null

try {
    Copy-Item -LiteralPath (Join-Path $repoRoot 'manifest.json') -Destination $stagingDirectory
    Copy-Item -LiteralPath (Join-Path $repoRoot 'src') -Destination $stagingDirectory -Recurse
    Copy-Item -LiteralPath (Join-Path $repoRoot 'icons') -Destination $stagingDirectory -Recurse
    Copy-Item -LiteralPath (Join-Path $repoRoot '_locales') -Destination $stagingDirectory -Recurse

    $artifactPath = Join-Path $distDirectory "daggerheart-su-companion-$($manifest.version).zip"
    Compress-Archive -Path (Join-Path $stagingDirectory '*') -DestinationPath $artifactPath -CompressionLevel Optimal -Force

    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $archive = [System.IO.Compression.ZipFile]::OpenRead($artifactPath)
    try {
        $entryNames = @($archive.Entries | ForEach-Object { $_.FullName.Replace('\', '/') })
        if ('manifest.json' -notin $entryNames) {
            throw 'The generated ZIP does not contain manifest.json at its root.'
        }
        if (@($entryNames | Where-Object { $_ -match '^[^/]+/manifest\.json$' }).Count -gt 0) {
            throw 'The generated ZIP contains a nested manifest.json.'
        }
    } finally {
        $archive.Dispose()
    }

    $hash = (Get-FileHash -LiteralPath $artifactPath -Algorithm SHA256).Hash.ToLowerInvariant()
    Write-Output "Built: $artifactPath"
    Write-Output "SHA256: $hash"
} finally {
    if (Test-Path -LiteralPath $stagingDirectory) {
        $resolvedStaging = (Resolve-Path -LiteralPath $stagingDirectory).Path
        $resolvedDist = (Resolve-Path -LiteralPath $distDirectory).Path
        if ([System.IO.Directory]::GetParent($resolvedStaging).FullName -ne $resolvedDist -or [System.IO.Path]::GetFileName($resolvedStaging) -notlike '.staging-*') {
            throw "Refusing to remove unexpected staging path: $resolvedStaging"
        }
        $reparsePoints = @(Get-ChildItem -LiteralPath $resolvedStaging -Force -Recurse | Where-Object { $_.Attributes -band [System.IO.FileAttributes]::ReparsePoint })
        if ($reparsePoints.Count -gt 0) {
            throw "Refusing to remove staging directory containing reparse points: $resolvedStaging"
        }
        Remove-Item -LiteralPath $resolvedStaging -Recurse -Force
    }
}
