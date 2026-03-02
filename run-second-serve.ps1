<#
run-second-serve.ps1 (formerly run-feedlink.ps1)
Utility to manage Second Serve backend during development on Windows (PowerShell)

Features:
- Install dependencies: -Install
- Initialize DB (first run): -InitDb
- Start server (production): -Start
- Start server in dev mode (nodemon): -Dev
- Stop server: -Stop
- Open site in default browser: -Open

Usage examples:
# Install deps, init DB, start server and open browser
.\run-second-serve.ps1 -Install -InitDb -Start -Open

# Start server in dev mode
.\run-second-serve.ps1 -Dev -Open

# Stop server
.\run-second-serve.ps1 -Stop
#>

param(
    [switch]$Install,
    [switch]$InitDb,
    [switch]$Dev,
    [switch]$Start,
    [switch]$Stop,
    [switch]$Open
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$serverDir = Join-Path $scriptDir "Second Serve\\src\\server"
$portUrl = "http://localhost:5000"

function Write-Info($m){ Write-Host "[run-second-serve] $m" -ForegroundColor Cyan }

if ($Stop) {
    Write-Info "Stopping Node processes..."
    Stop-Process -Name node -Force -ErrorAction SilentlyContinue
    Write-Info "Stopped."
    exit 0
}

if (-not (Test-Path $serverDir)) {
    Write-Host "ERROR: server directory not found: $serverDir" -ForegroundColor Red
    exit 1
}

Push-Location $serverDir

if ($Install) {
    Write-Info "Installing npm dependencies in $serverDir..."
    npm install
}

if ($InitDb) {
    Write-Info "Initializing database (npm run init-db)..."
    npm run init-db
}

if ($Dev) { $Start = $true }

if ($Start) {
    Write-Info "Stopping any existing Node processes..."
    Stop-Process -Name node -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1

    if ($Dev) {
        Write-Info "Starting backend in dev mode (nodemon) in a new PowerShell window..."
        Start-Process powershell -ArgumentList "-NoExit","-Command","cd '$serverDir'; npm run dev" -WorkingDirectory $serverDir
    } else {
        Write-Info "Starting backend (production) in a new PowerShell window..."
        Start-Process powershell -ArgumentList "-NoExit","-Command","cd '$serverDir'; npm start" -WorkingDirectory $serverDir
    }

    Start-Sleep -Seconds 1
}

if ($Open) {
    Write-Info "Opening $portUrl in default browser..."
    Start-Process $portUrl
}

Pop-Location

Write-Info "Done."
