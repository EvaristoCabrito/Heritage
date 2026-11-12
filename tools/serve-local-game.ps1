param(
  [string]$Root = (Split-Path -Parent $PSScriptRoot),
  [int]$Port = 8765
)

$ErrorActionPreference = 'Stop'
$rootPath = [System.IO.Path]::GetFullPath($Root).TrimEnd('\') + '\'
$prefix = "http://127.0.0.1:$Port/"

# If this game's local server is already running, keep using it.
$probe = New-Object System.Net.Sockets.TcpClient
try {
  $probe.Connect('127.0.0.1', $Port)
  $probe.Close()
  exit 0
} catch {
  $probe.Close()
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
$listener.Start()

$mime = @{
  '.html' = 'text/html; charset=utf-8'
  '.css' = 'text/css; charset=utf-8'
  '.js' = 'text/javascript; charset=utf-8'
  '.json' = 'application/json; charset=utf-8'
  '.svg' = 'image/svg+xml'
  '.png' = 'image/png'
  '.jpg' = 'image/jpeg'
  '.jpeg' = 'image/jpeg'
  '.webp' = 'image/webp'
  '.gif' = 'image/gif'
  '.mp3' = 'audio/mpeg'
  '.ogg' = 'audio/ogg'
  '.wav' = 'audio/wav'
  '.ttf' = 'font/ttf'
  '.woff' = 'font/woff'
  '.woff2' = 'font/woff2'
}

function Get-GameVersion {
  $files = @()
  foreach ($relative in @('index.html', 'app.js', 'app.css', 'monarch.js', 'spell-fx.js', 'data', 'public', 'Music')) {
    $target = Join-Path $rootPath $relative
    if (Test-Path -LiteralPath $target -PathType Leaf) {
      $files += Get-Item -LiteralPath $target
    } elseif (Test-Path -LiteralPath $target -PathType Container) {
      $files += Get-ChildItem -LiteralPath $target -File -Recurse -Force
    }
  }
  $stamp = ($files | Sort-Object FullName | ForEach-Object {
    '{0}|{1}|{2}' -f $_.FullName.Substring($rootPath.Length), $_.Length, $_.LastWriteTimeUtc.Ticks
  }) -join "`n"
  $sha = [System.Security.Cryptography.SHA256]::Create()
  try {
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($stamp)
    return [System.BitConverter]::ToString($sha.ComputeHash($bytes)).Replace('-', '')
  } finally {
    $sha.Dispose()
  }
}

while ($listener.IsListening) {
  $context = $null
  try {
    $context = $listener.GetContext()
    $response = $context.Response
    $response.Headers['Cache-Control'] = 'no-store, no-cache, must-revalidate'
    $response.Headers['X-Content-Type-Options'] = 'nosniff'

    $path = [System.Uri]::UnescapeDataString($context.Request.Url.AbsolutePath)
    if ($path -eq '/__version') {
      $bytes = [System.Text.Encoding]::UTF8.GetBytes((Get-GameVersion))
      $response.ContentType = 'text/plain; charset=utf-8'
      $response.StatusCode = 200
    } else {
      $relative = $path.TrimStart('/').Replace('/', [System.IO.Path]::DirectorySeparatorChar)
      if ([string]::IsNullOrWhiteSpace($relative)) { $relative = 'index.html' }
      $fullPath = [System.IO.Path]::GetFullPath((Join-Path $rootPath $relative))
      if (-not $fullPath.StartsWith($rootPath, [System.StringComparison]::OrdinalIgnoreCase)) {
        $response.StatusCode = 403
        $bytes = [System.Text.Encoding]::UTF8.GetBytes('Forbidden')
      } elseif (-not (Test-Path -LiteralPath $fullPath -PathType Leaf)) {
        $response.StatusCode = 404
        $bytes = [System.Text.Encoding]::UTF8.GetBytes('Not found')
      } else {
        $extension = [System.IO.Path]::GetExtension($fullPath).ToLowerInvariant()
        $response.ContentType = $mime[$extension]
        if (-not $response.ContentType) { $response.ContentType = 'application/octet-stream' }
        $response.StatusCode = 200
        $bytes = [System.IO.File]::ReadAllBytes($fullPath)
      }
    }
    $response.ContentLength64 = $bytes.Length
    $response.OutputStream.Write($bytes, 0, $bytes.Length)
    $response.Close()
  } catch {
    if ($context -and $context.Response) {
      try { $context.Response.StatusCode = 500; $context.Response.Close() } catch {}
    }
  }
}
