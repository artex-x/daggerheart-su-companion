[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$repoRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$distDirectory = Join-Path $repoRoot 'dist'
$sourcePath = Join-Path $repoRoot 'daggerheart-su-companion.user.js'

& (Join-Path $PSScriptRoot 'validate.ps1')
[System.IO.Directory]::CreateDirectory($distDirectory) | Out-Null

$artifactPath = Join-Path $distDirectory 'daggerheart-su-companion.user.js'
Copy-Item -LiteralPath $sourcePath -Destination $artifactPath -Force
$hash = (Get-FileHash -LiteralPath $artifactPath -Algorithm SHA256).Hash.ToLowerInvariant()

Write-Output "Built: $artifactPath"
Write-Output "SHA256: $hash"
