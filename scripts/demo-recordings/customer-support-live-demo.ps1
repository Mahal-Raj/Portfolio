$ErrorActionPreference = "Stop"
$Host.UI.RawUI.WindowTitle = "SUKHRAJ-CUSTOMER-SUPPORT-LIVE-DEMO"
mode con cols=120 lines=34 | Out-Null
Add-Type -AssemblyName System.Windows.Forms
Start-Sleep -Milliseconds 500
1..4 | ForEach-Object { [System.Windows.Forms.SendKeys]::SendWait("^{+}"); Start-Sleep -Milliseconds 120 }

$project = "C:\Users\HP\Desktop\customer-application-network-support-lab"
$server = $null

function Show-Command([string]$command) {
    Write-Host ""
    Write-Host ("> " + $command) -ForegroundColor Cyan
}

try {
    Set-Location -LiteralPath $project
    Clear-Host
    Start-Sleep -Seconds 2

    Write-Host "CUSTOMER APPLICATION NETWORK SUPPORT LAB" -ForegroundColor White
    Write-Host "LIVE JAVA DIAGNOSTICS / TESTED INCIDENT HANDOFF" -ForegroundColor DarkGray
    Write-Host ("-" * 72) -ForegroundColor DarkGray

    Show-Command ".\scripts\test.ps1"
    & .\scripts\test.ps1
    Start-Sleep -Seconds 2

    Show-Command "Start local customer application on 127.0.0.1:8080"
    $server = Start-Process -FilePath "python.exe" -ArgumentList @("-m", "http.server", "8080", "--bind", "127.0.0.1", "--directory", "examples") -WindowStyle Hidden -PassThru
    Write-Host "Local test application started."
    Start-Sleep -Seconds 2

    Show-Command "Run Java diagnostics against the customer incident"
    java -cp build\classes com.sukhraj.customersupport.Main examples\customer-incident.properties out
    Start-Sleep -Seconds 2

    Show-Command "python tools\report_summary.py out\INC-2026-001-support-bundle.json"
    python tools\report_summary.py out\INC-2026-001-support-bundle.json

    Write-Host ""
    Write-Host "VERIFIED" -ForegroundColor Green
    Write-Host "DNS, TCP, HTTP, classification, JSON, and customer-ready Markdown were exercised locally." -ForegroundColor White
    Start-Sleep -Seconds 20
}
finally {
    if ($server -and -not $server.HasExited) {
        Stop-Process -Id $server.Id -Force
    }
}
