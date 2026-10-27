# 将个人作品素材转换为网页可用图片
# - 栅格图最长边 1800px，JPEG 质量 88（带透明通道的图保留 PNG）
# - GIF 原样复制以保留动画
# - 输出到 img/work/p1..p6，并生成尺寸报告

Add-Type -AssemblyName System.Drawing

$sourceRoot = 'D:\Table\DSH_Test\个人作品素材'
$projectRoot = 'D:\Table\DSH_Test\portfolio-for-everyone-main'
$outputRoot = Join-Path $projectRoot 'img\work'

$map = @(
  @{ src = '1\海报海报.png';                 dst = 'p1\poster-portrait.jpg';            kind = 'jpeg' },
  @{ src = '1\横海报.png';                   dst = 'p1\poster-landscape.jpg';           kind = 'jpeg' },
  @{ src = '1\幻想氛围.png';                 dst = 'p1\scene-fantasy-night.jpg';        kind = 'jpeg' },
  @{ src = '1\现实氛围.png';                 dst = 'p1\scene-reality-afternoon.jpg';    kind = 'jpeg' },
  @{ src = '1\1111.png';                     dst = 'p1\lineart-workshop.jpg';           kind = 'jpeg' },
  @{ src = '1\2222.png';                     dst = 'p1\lineart-study.jpg';              kind = 'jpeg' },
  @{ src = '1\现2改.png';                    dst = 'p1\lineart-room-iso.jpg';           kind = 'jpeg' },

  @{ src = '2\GJ_2.png';                     dst = 'p2\poster-dont-press.jpg';          kind = 'jpeg' },
  @{ src = '2\GJ_2.jpg';                     dst = 'p2\fps-yard.jpg';                   kind = 'jpeg' },
  @{ src = '2\2D_1.png';                     dst = 'p2\platformer-01.jpg';              kind = 'jpeg' },
  @{ src = '2\2D_2.png';                     dst = 'p2\platformer-02.jpg';              kind = 'jpeg' },
  @{ src = '2\Demo_1.png';                   dst = 'p2\fps-demo-01.jpg';                kind = 'jpeg' },
  @{ src = '2\Demo_2.png';                   dst = 'p2\fps-blockout.jpg';               kind = 'jpeg' },
  @{ src = '2\YX_1.gif';                     dst = 'p2\nightwalk-01.gif';               kind = 'gif'  },
  @{ src = '2\YX_2.gif';                     dst = 'p2\nightwalk-02.gif';               kind = 'gif'  },

  @{ src = '3\CSP_1.png';                    dst = 'p3\csp-editing.jpg';                kind = 'jpeg' },
  @{ src = '3\UE_1.png';                     dst = 'p3\ue-corridor-green.jpg';          kind = 'jpeg' },
  @{ src = '3\UE_2.png';                     dst = 'p3\ue-corridor-deer.jpg';           kind = 'jpeg' },

  @{ src = '4\3D_1.png';                     dst = 'p4\garden-pavilion.jpg';            kind = 'jpeg' },
  @{ src = '4\3D_2.png';                     dst = 'p4\forest-ancient-tree.jpg';        kind = 'jpeg' },
  @{ src = '4\2D_1.png';                     dst = 'p4\scene-platformer.jpg';           kind = 'jpeg' },
  @{ src = '4\2D_2.png';                     dst = 'p4\scene-blueprint.jpg';            kind = 'jpeg' },
  @{ src = '4\Demo_1.png';                   dst = 'p4\tile-room-01.jpg';               kind = 'jpeg' },
  @{ src = '4\Demo_2.png';                   dst = 'p4\tile-room-02.jpg';               kind = 'jpeg' },
  @{ src = '4\Demo3.gif';                    dst = 'p4\elevator-night.gif';             kind = 'gif'  },

  @{ src = '5\Class_1.jpg';                  dst = 'p5\illustration-crowd.jpg';         kind = 'jpeg' },
  @{ src = '5\Class_2.png';                  dst = 'p5\color-study.jpg';                kind = 'jpeg' },
  @{ src = '5\Class_3.png';                  dst = 'p5\head-studies.jpg';               kind = 'jpeg' },
  @{ src = '5\Class_4.jpg';                  dst = 'p5\line-figure.jpg';                kind = 'jpeg' },
  @{ src = '5\Class_5.jpg';                  dst = 'p5\character-turnaround.jpg';       kind = 'jpeg' },

  @{ src = '6\Pixel_1.png';                  dst = 'p6\pixel-forest.jpg';               kind = 'jpeg' },
  @{ src = '6\Pixel_2.png';                  dst = 'p6\pixel-poster.jpg';               kind = 'jpeg' },
  @{ src = '6\Pixel_3.gif';                  dst = 'p6\pixel-inventory.gif';            kind = 'gif'  },
  @{ src = '6\Font_1.png';                   dst = 'p6\typography-01.jpg';              kind = 'jpeg' },
  @{ src = '6\Font_2.png';                   dst = 'p6\typography-02.jpg';              kind = 'jpeg' },
  @{ src = '6\Font_3.png';                   dst = 'p6\typography-03.jpg';              kind = 'jpeg' },
  @{ src = '6\Dog_1.gif';                    dst = 'p6\dog-run.gif';                    kind = 'gif'  },
  @{ src = '6\Dog_2.gif';                    dst = 'p6\dog-sit.gif';                    kind = 'gif'  }
)

if (Test-Path $outputRoot) { Remove-Item $outputRoot -Recurse -Force }

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
  Where-Object { $_.MimeType -eq 'image/jpeg' } | Select-Object -First 1
$qualityEncoder = [System.Drawing.Imaging.Encoder]::Quality

function Test-HasTransparency([System.Drawing.Bitmap]$bmp) {
  if (-not ($bmp.PixelFormat.ToString() -match 'Alpha')) { return $false }
  $w = $bmp.Width; $h = $bmp.Height
  $xs = @(0, [int]($w / 2), $w - 1, [int]($w / 4), [int]($w * 3 / 4))
  $ys = @(0, [int]($h / 2), $h - 1, [int]($h / 4), [int]($h * 3 / 4))
  foreach ($x in $xs) {
    foreach ($y in $ys) {
      if ($bmp.GetPixel($x, $y).A -lt 250) { return $true }
    }
  }
  return $false
}

$report = @()

foreach ($item in $map) {
  $srcPath = Join-Path $sourceRoot $item.src
  $dstPath = Join-Path $outputRoot $item.dst
  $dstDir = Split-Path $dstPath -Parent
  if (-not (Test-Path $dstDir)) { New-Item -ItemType Directory -Force -Path $dstDir | Out-Null }

  if ($item.kind -eq 'gif') {
    Copy-Item -LiteralPath $srcPath -Destination $dstPath -Force
    $img = [System.Drawing.Image]::FromFile($dstPath)
    $report += [PSCustomObject]@{
      src = $item.src; dst = $item.dst; w = $img.Width; h = $img.Height;
      format = 'gif'; bytes = (Get-Item $dstPath).Length
    }
    $img.Dispose()
    continue
  }

  $src = [System.Drawing.Image]::FromFile($srcPath)
  try {
    $bmp = New-Object System.Drawing.Bitmap($src)
    $keepAlpha = Test-HasTransparency $bmp
    $maxEdge = 1800.0
    $scale = [Math]::Min(1.0, $maxEdge / [Math]::Max($bmp.Width, $bmp.Height))
    $nw = [Math]::Max(1, [int][Math]::Round($bmp.Width * $scale))
    $nh = [Math]::Max(1, [int][Math]::Round($bmp.Height * $scale))

    $format = if ($keepAlpha) { [System.Drawing.Imaging.PixelFormat]::Format32bppArgb } else { [System.Drawing.Imaging.PixelFormat]::Format24bppRgb }
    $dest = New-Object System.Drawing.Bitmap($nw, $nh, $format)
    $g = [System.Drawing.Graphics]::FromImage($dest)
    $g.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($bmp, 0, 0, $nw, $nh)
    $g.Dispose()

    if ($keepAlpha) {
      $dest.Save($dstPath, [System.Drawing.Imaging.ImageFormat]::Png)
      $fmt = 'png'
    } else {
      $ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
      $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter($qualityEncoder, [long]88)
      $dest.Save($dstPath, $jpegCodec, $ep)
      $ep.Dispose()
      $fmt = 'jpeg'
    }

    $report += [PSCustomObject]@{
      src = $item.src; dst = $item.dst; w = $nw; h = $nh;
      format = $fmt; bytes = (Get-Item $dstPath).Length
    }
    $dest.Dispose()
    $bmp.Dispose()
  }
  finally {
    $src.Dispose()
  }
}

$report | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath (Join-Path $outputRoot '_report.json') -Encoding UTF8

Write-Host ("Prepared {0} images, total {1:N1} MB" -f $report.Count, (($report | Measure-Object bytes -Sum).Sum / 1MB))
$report | Group-Object { $_.dst.Split('\')[0] } | ForEach-Object {
  Write-Host ("  {0}: {1} files, {2:N1} MB" -f $_.Name, $_.Count, (($_.Group | Measure-Object bytes -Sum).Sum / 1MB))
}
