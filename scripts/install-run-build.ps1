Param(
    [ValidateSet('install','dev','build:web','build:android:debug','build:android:release','db:prepare','all')]
    [string]$Task = 'all',

    [string]$NodeVersion = '',
    [string]$EnvFile = '.env'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Write-Section($Message) {
    Write-Host "`n=== $Message ===" -ForegroundColor Cyan
}

function Assert-Command($Name, $InstallHint) {
    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "Required command '$Name' not found. Install it first. Hint: $InstallHint"
    }
}

function Use-Node {
    param([string]$Desired)
    if ([string]::IsNullOrWhiteSpace($Desired)) { return }
    if (Get-Command nvm -ErrorAction SilentlyContinue) {
        Write-Section "Using Node $Desired via nvm"
        nvm install $Desired | Out-Host
        nvm use $Desired | Out-Host
    } else {
        Write-Warning "nvm not found; ensure your system Node == $Desired"
    }
}

function Load-Env($Path) {
    if (-not (Test-Path $Path)) {
        Write-Warning "Env file '$Path' not found. Create it or pass -EnvFile. See .env.example."
        return
    }
    Write-Section "Loading environment from $Path"
    Get-Content $Path | ForEach-Object {
        if (-not $_ -or $_.Trim().StartsWith('#')) { return }
        $idx = $_.IndexOf('=')
        if ($idx -lt 1) { return }
        $k = $_.Substring(0,$idx).Trim()
        $v = $_.Substring($idx+1).Trim().Trim('"')
        [System.Environment]::SetEnvironmentVariable($k, $v)
    }
}

function Install-Dependencies {
    Write-Section "Installing Node dependencies"
    Assert-Command -Name npm -InstallHint 'Install Node.js LTS from nodejs.org or use nvm.'
    npm ci --no-audit --no-fund | Out-Host
}

function Prepare-Database {
    Write-Section "Preparing database (Prisma)"
    if (-not (Test-Path 'prisma/schema.prisma')) {
        Write-Host 'No Prisma schema found. Skipping DB prepare.' -ForegroundColor Yellow
        return
    }
    Assert-Command -Name npx -InstallHint 'Install Node.js which includes npx.'
    if (-not $env:DATABASE_URL) {
        Write-Warning 'DATABASE_URL is not set. Set it in your .env before running migrations.'
        return
    }
    npx --yes prisma generate | Out-Host
    npx --yes prisma db push | Out-Host
    if (Test-Path 'scripts/seed.ts') {
        Write-Section "Seeding database"
        npx --yes tsx --require dotenv/config scripts/seed.ts | Out-Host
    }
}

function Run-Dev {
    Write-Section "Starting Next.js dev server"
    npm run dev | Out-Host
}

function Build-Web {
    Write-Section "Building Next.js web app"
    npm run build | Out-Host
}

function Build-AndroidDebug {
    Write-Section "Building Android Debug APK"
    npm run cap:sync | Out-Host
    npm run android:assembleDebug | Out-Host
}

function Build-AndroidRelease {
    Write-Section "Building Android Release APK (unsigned unless signing configured)"
    npm run cap:sync | Out-Host
    npm run android:assembleRelease | Out-Host
}

# Entry
Push-Location (Resolve-Path "$PSScriptRoot/..")
try {
    Use-Node -Desired $NodeVersion
    Load-Env -Path $EnvFile

    switch ($Task) {
        'install' { Install-Dependencies }
        'db:prepare' { Prepare-Database }
        'dev' { Install-Dependencies; Prepare-Database; Run-Dev }
        'build:web' { Install-Dependencies; Prepare-Database; Build-Web }
        'build:android:debug' { Install-Dependencies; Build-Web; Build-AndroidDebug }
        'build:android:release' { Install-Dependencies; Build-Web; Build-AndroidRelease }
        'all' { Install-Dependencies; Prepare-Database; Build-Web; Build-AndroidDebug }
        default { throw "Unknown task: $Task" }
    }
}
finally {
    Pop-Location
}

Write-Host "`nDone." -ForegroundColor Green

