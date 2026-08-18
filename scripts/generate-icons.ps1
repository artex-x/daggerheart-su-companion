[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$repoRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$iconsDirectory = Join-Path $repoRoot 'icons'
[System.IO.Directory]::CreateDirectory($iconsDirectory) | Out-Null

$background = [System.Drawing.ColorTranslator]::FromHtml('#1D1D35')
$gold = [System.Drawing.ColorTranslator]::FromHtml('#F4C542')
$cream = [System.Drawing.ColorTranslator]::FromHtml('#FFF8D6')

foreach ($size in @(16, 32, 48, 128)) {
    $bitmap = [System.Drawing.Bitmap]::new($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)

    try {
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
        $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
        $graphics.Clear($background)

        $outer = [System.Drawing.PointF[]]@(
            [System.Drawing.PointF]::new($size * 0.50, $size * 0.08),
            [System.Drawing.PointF]::new($size * 0.90, $size * 0.50),
            [System.Drawing.PointF]::new($size * 0.50, $size * 0.92),
            [System.Drawing.PointF]::new($size * 0.10, $size * 0.50)
        )
        $inner = [System.Drawing.PointF[]]@(
            [System.Drawing.PointF]::new($size * 0.50, $size * 0.18),
            [System.Drawing.PointF]::new($size * 0.80, $size * 0.50),
            [System.Drawing.PointF]::new($size * 0.50, $size * 0.82),
            [System.Drawing.PointF]::new($size * 0.20, $size * 0.50)
        )

        $goldBrush = [System.Drawing.SolidBrush]::new($gold)
        $backgroundBrush = [System.Drawing.SolidBrush]::new($background)
        $textBrush = [System.Drawing.SolidBrush]::new($cream)
        try {
            $graphics.FillPolygon($goldBrush, $outer)
            $graphics.FillPolygon($backgroundBrush, $inner)

            $label = if ($size -lt 32) { 'D' } else { 'DH' }
            $fontSize = if ($size -lt 32) { $size * 0.42 } else { $size * 0.25 }
            $font = [System.Drawing.Font]::new('Segoe UI', $fontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
            $format = [System.Drawing.StringFormat]::new()
            try {
                $format.Alignment = [System.Drawing.StringAlignment]::Center
                $format.LineAlignment = [System.Drawing.StringAlignment]::Center
                $graphics.DrawString($label, $font, $textBrush, [System.Drawing.RectangleF]::new(0, 0, $size, $size), $format)
            } finally {
                $format.Dispose()
                $font.Dispose()
            }
        } finally {
            $goldBrush.Dispose()
            $backgroundBrush.Dispose()
            $textBrush.Dispose()
        }

        $outputPath = Join-Path $iconsDirectory "icon-$size.png"
        $bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
        Write-Output "Generated $outputPath"
    } finally {
        $graphics.Dispose()
        $bitmap.Dispose()
    }
}
