param(
  [string]$ComposeFile = "docker-compose.yml",
  [string]$PublicBaseUrl = ""
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path -LiteralPath $ComposeFile)) {
  Write-Error "Missing compose file: $ComposeFile"
}

Write-Host "Running preflight..." -ForegroundColor Cyan
powershell -NoProfile -ExecutionPolicy Bypass -File "scripts/preflight.ps1"

Write-Host "Building and starting containers..." -ForegroundColor Cyan
docker compose -f $ComposeFile up -d --build

if ([string]::IsNullOrWhiteSpace($PublicBaseUrl)) {
  $PublicBaseUrl = "http://localhost:8080"
}

$healthUrl = "$PublicBaseUrl/healthz"
$readyUrl = "$PublicBaseUrl/readyz"

Write-Host "Checking $healthUrl" -ForegroundColor Cyan
$health = Invoke-WebRequest -Uri $healthUrl -UseBasicParsing -TimeoutSec 30
Write-Host "healthz status: $($health.StatusCode)" -ForegroundColor Green

Write-Host "Checking $readyUrl" -ForegroundColor Cyan
$ready = Invoke-WebRequest -Uri $readyUrl -UseBasicParsing -TimeoutSec 30
Write-Host "readyz status: $($ready.StatusCode)" -ForegroundColor Green

Write-Host "Deploy completed." -ForegroundColor Green
