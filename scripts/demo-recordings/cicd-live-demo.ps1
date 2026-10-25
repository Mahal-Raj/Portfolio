$ErrorActionPreference = "Stop"
$Host.UI.RawUI.WindowTitle = "SUKHRAJ-CICD-LIVE-DEMO"
mode con cols=120 lines=34 | Out-Null
Add-Type -AssemblyName System.Windows.Forms
Start-Sleep -Milliseconds 500
1..4 | ForEach-Object { [System.Windows.Forms.SendKeys]::SendWait("^{+}"); Start-Sleep -Milliseconds 120 }

$project = "C:\Users\HP\AppData\Local\Temp\sukhraj-portfolio-project-sources-20260824\Project2-MyWeb_CICD"
$container = "sukhraj-cicd-demo-running"
$image = "sukhraj-cicd-demo:local"

function Show-Command([string]$command) {
    Write-Host ""
    Write-Host ("> " + $command) -ForegroundColor Cyan
}

Set-Location -LiteralPath $project
$existingContainer = docker container ls -a --filter "name=^/$container$" --format "{{.Names}}"
if ($existingContainer -eq $container) {
    docker rm -f $container | Out-Null
}
Clear-Host
Start-Sleep -Seconds 2

Write-Host "CONTAINER DELIVERY PIPELINE" -ForegroundColor White
Write-Host "LIVE DOCKER RUN / REAL HTTP RESPONSES" -ForegroundColor DarkGray
Write-Host ("-" * 72) -ForegroundColor DarkGray

Show-Command "npm test"
npm test
Start-Sleep -Seconds 2

Show-Command "docker build --quiet -t sukhraj-cicd-demo:local ."
$imageId = docker build --quiet -t $image .
Write-Host ("Built image: " + $imageId.Substring(0, 19) + "...")
Start-Sleep -Seconds 2

Show-Command "docker run -d -p 3001:3001 -e ENVIRONMENT=local-demo"
$containerId = docker run -d --name $container -p 3001:3001 -e ENVIRONMENT=local-demo $image
Write-Host ("Started container: " + $containerId.Substring(0, 12))
Start-Sleep -Seconds 3

Show-Command "GET http://127.0.0.1:3001/health"
$health = Invoke-RestMethod -Uri "http://127.0.0.1:3001/health"
$health | Select-Object status, environment | ConvertTo-Json
Start-Sleep -Seconds 2

Show-Command "GET http://127.0.0.1:3001/api/info"
$info = Invoke-RestMethod -Uri "http://127.0.0.1:3001/api/info"
$info | Select-Object app, version, environment | ConvertTo-Json
Start-Sleep -Seconds 2

Show-Command "docker ps --filter name=sukhraj-cicd-demo-running"
docker ps --filter "name=$container" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

Write-Host ""
Write-Host "VERIFIED" -ForegroundColor Green
Write-Host "The actual Express service is responding from a running Docker container." -ForegroundColor White
Start-Sleep -Seconds 20

docker rm -f $container 2>$null | Out-Null
