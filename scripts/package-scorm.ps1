$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$distPath = Join-Path $projectRoot "dist"
$templatePath = Join-Path $projectRoot "scorm/imsmanifest.xml"
$releasePath = Join-Path $projectRoot "release"
$packagePath = Join-Path $releasePath "Right-G1-Teacher-SCORM12.zip"

if (-not (Test-Path -LiteralPath (Join-Path $distPath "index.html"))) {
  throw "Build output not found. Run npm run build first."
}

$fileEntries = Get-ChildItem -LiteralPath $distPath -Recurse -File |
  Where-Object { $_.Name -ne "imsmanifest.xml" } |
  Sort-Object FullName |
  ForEach-Object {
    $relativePath = $_.FullName.Substring($distPath.Length + 1).Replace("\", "/")
    $escapedPath = [System.Security.SecurityElement]::Escape($relativePath)
    "      <file href=`"$escapedPath`" />"
  }

$manifest = Get-Content -LiteralPath $templatePath -Raw
$manifest = $manifest.Replace("<!-- SCORM_FILES -->", ($fileEntries -join "`n"))
Set-Content -LiteralPath (Join-Path $distPath "imsmanifest.xml") -Value $manifest -Encoding UTF8

New-Item -ItemType Directory -Path $releasePath -Force | Out-Null
if (Test-Path -LiteralPath $packagePath) {
  Remove-Item -LiteralPath $packagePath -Force
}

Add-Type -AssemblyName System.IO.Compression.FileSystem
Add-Type -AssemblyName System.IO.Compression
$archive = [System.IO.Compression.ZipFile]::Open(
  $packagePath,
  [System.IO.Compression.ZipArchiveMode]::Create
)
try {
  Get-ChildItem -LiteralPath $distPath -Recurse -File | ForEach-Object {
    $relativePath = $_.FullName.Substring($distPath.Length + 1).Replace("\", "/")
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
      $archive,
      $_.FullName,
      $relativePath,
      [System.IO.Compression.CompressionLevel]::Optimal
    ) | Out-Null
  }
}
finally {
  $archive.Dispose()
}
Write-Output "SCORM package created: $packagePath"
