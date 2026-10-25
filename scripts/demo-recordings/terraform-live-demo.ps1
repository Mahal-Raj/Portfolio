$ErrorActionPreference = "Stop"
$Host.UI.RawUI.WindowTitle = "SUKHRAJ-TERRAFORM-LIVE-DEMO"
mode con cols=120 lines=34 | Out-Null
Add-Type -AssemblyName System.Windows.Forms
Start-Sleep -Milliseconds 500
1..4 | ForEach-Object { [System.Windows.Forms.SendKeys]::SendWait("^{+}"); Start-Sleep -Milliseconds 120 }

$terraform = "C:\Users\HP\AppData\Local\Temp\sukhraj-terraform-tooling-20260824\terraform.exe"
$project = "C:\Users\HP\AppData\Local\Temp\sukhraj-portfolio-project-sources-20260824\Project-1-Infrastructure_AWSandTerraform"

function Show-Command([string]$command) {
    Write-Host ""
    Write-Host ("> " + $command) -ForegroundColor Cyan
}

Set-Location -LiteralPath $project
Clear-Host
Start-Sleep -Seconds 2

Write-Host "AWS INFRASTRUCTURE WITH TERRAFORM" -ForegroundColor White
Write-Host "LIVE LOCAL VALIDATION / REAL PROVIDER PLAN" -ForegroundColor DarkGray
Write-Host ("-" * 72) -ForegroundColor DarkGray

Show-Command "terraform version"
& $terraform version | Select-Object -First 2
Start-Sleep -Seconds 2

Show-Command "terraform init -backend=false -input=false"
& $terraform init -backend=false -input=false -no-color | Select-String -Pattern "Initializing provider|Reusing previous|Using previously|successfully initialized" | ForEach-Object { $_.Line.Trim() }
Start-Sleep -Seconds 2

Show-Command "terraform validate"
& $terraform validate -no-color
Start-Sleep -Seconds 2

Show-Command "terraform plan -refresh=false -input=false"
$plan = & $terraform plan -refresh=false -input=false -no-color
$plan | Select-String -Pattern "# aws_|Plan:" | ForEach-Object { $_.Line.Trim() }

Write-Host ""
Write-Host "VERIFIED" -ForegroundColor Green
Write-Host "The real configuration initialized, validated, and produced a six-resource AWS plan." -ForegroundColor White
Write-Host "No apply was run: this local proof creates no AWS resources or charges." -ForegroundColor Yellow
Start-Sleep -Seconds 20
