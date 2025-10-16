# Design-Rite Super Agent Ecosystem Launcher
# This script starts all microservices required for Super Agent orchestration

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Design-Rite Super Agent Ecosystem" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Define service paths and ports
$services = @(
    @{
        Name = "Main Platform V4"
        Path = "C:\Users\dkozi\Projects\design-rite-v4"
        Port = 3000
        Command = "npm run dev"
        Color = "Green"
    },
    @{
        Name = "Portal V2"
        Path = "C:\Users\dkozi\Projects\design-rite-portal-v2"
        Port = 3001
        Command = "npm run dev"
        Color = "Blue"
    },
    @{
        Name = "Spatial Studio"
        Path = "C:\Users\dkozi\Design-Rite Corp\design-rite-spatial-studio"
        Port = 3020
        Command = "npm start"
        Color = "Magenta"
    },
    @{
        Name = "Creative Studio"
        Path = "C:\Users\dkozi\Design-Rite Corp\design-rite-creative-studio"
        Port = 3030
        Command = "npm start"
        Color = "Yellow"
    },
    @{
        Name = "MCP Server"
        Path = "C:\Users\dkozi\Design-Rite Corp\design-rite-mcp-server"
        Port = 8000
        Command = "python app.py"
        Color = "DarkYellow"
    },
    @{
        Name = "Super Agent"
        Path = "C:\Users\dkozi\Design-Rite Corp\super-agent"
        Port = 9500
        Command = "npm start"
        Color = "Red"
    }
)

# Check if ports are already in use
Write-Host "Checking for port conflicts..." -ForegroundColor Yellow
$portsInUse = @()

foreach ($service in $services) {
    $port = $service.Port
    $connection = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue

    if ($connection) {
        $portsInUse += $port
        Write-Host "  [WARNING] Port $port is already in use (possibly by $($service.Name))" -ForegroundColor DarkYellow
    }
}

if ($portsInUse.Count -gt 0) {
    Write-Host ""
    $response = Read-Host "Some ports are already in use. Continue anyway? (y/n)"
    if ($response -ne 'y') {
        Write-Host "Aborted by user." -ForegroundColor Red
        exit
    }
}

Write-Host ""
Write-Host "Starting all services..." -ForegroundColor Green
Write-Host ""

# Start each service in a new PowerShell window
foreach ($service in $services) {
    $serviceName = $service.Name
    $servicePath = $service.Path
    $servicePort = $service.Port
    $serviceCommand = $service.Command
    $serviceColor = $service.Color

    # Check if directory exists
    if (-Not (Test-Path $servicePath)) {
        Write-Host "  [SKIP] $serviceName - Directory not found: $servicePath" -ForegroundColor DarkGray
        continue
    }

    Write-Host "  [START] $serviceName (Port $servicePort)" -ForegroundColor $serviceColor

    # Create PowerShell command to run in new window
    $command = "cd '$servicePath'; $serviceCommand"

    # Start new PowerShell window with service
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $command

    # Wait a bit before starting next service
    Start-Sleep -Seconds 2
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  All Services Started!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Service Endpoints:" -ForegroundColor White
Write-Host "  Main Platform:    http://localhost:3000" -ForegroundColor Green
Write-Host "  Admin Dashboard:  http://localhost:3000/admin" -ForegroundColor Green
Write-Host "  Super Agent UI:   http://localhost:3000/admin/super-agent" -ForegroundColor Red
Write-Host "  Portal V2:        http://localhost:3001" -ForegroundColor Blue
Write-Host "  Spatial Studio:   http://localhost:3020" -ForegroundColor Magenta
Write-Host "  Creative Studio:  http://localhost:3030" -ForegroundColor Yellow
Write-Host "  MCP Server:       http://localhost:8000" -ForegroundColor DarkYellow
Write-Host "  Super Agent API:  http://localhost:9500" -ForegroundColor Red
Write-Host ""
Write-Host "Health Check:" -ForegroundColor White
Write-Host "  API Status:       http://localhost:3000/api/super-agent/status" -ForegroundColor Cyan
Write-Host "  Available Tools:  http://localhost:3000/api/super-agent/tools" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to close this window (services will continue running)..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
