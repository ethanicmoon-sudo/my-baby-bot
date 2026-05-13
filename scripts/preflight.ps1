param(
  [string]$EnvFile = ".env"
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path -LiteralPath $EnvFile)) {
  Write-Error "Missing $EnvFile"
}

$required = @(
  "NODE_ENV",
  "APP_BASE_URL",
  "CORS_ORIGIN",
  "DATABASE_URL",
  "JWT_SECRET",
  "REDIS_URL"
)

$values = @{}
Get-Content -LiteralPath $EnvFile | ForEach-Object {
  $line = $_.Trim()
  if (-not $line -or $line.StartsWith("#")) { return }
  $pair = $line -split "=", 2
  if ($pair.Count -eq 2) {
    $values[$pair[0].Trim()] = $pair[1].Trim()
  }
}

$missing = @()
foreach ($key in $required) {
  if (-not $values.ContainsKey($key) -or [string]::IsNullOrWhiteSpace($values[$key])) {
    $missing += $key
  }
}

if ($missing.Count -gt 0) {
  Write-Error ("Missing required env keys: " + ($missing -join ", "))
}

if ($values["NODE_ENV"] -ne "production") {
  Write-Error "NODE_ENV must be production"
}

foreach ($urlKey in @("APP_BASE_URL", "CORS_ORIGIN")) {
  $v = $values[$urlKey]
  if (-not $v.StartsWith("https://")) {
    Write-Error "$urlKey must start with https://"
  }
}

if ($values["APP_BASE_URL"] -ne $values["CORS_ORIGIN"]) {
  Write-Warning "APP_BASE_URL and CORS_ORIGIN are different. This is okay only if you intentionally use cross-domain setup."
}

Write-Host "Preflight checks passed." -ForegroundColor Green
