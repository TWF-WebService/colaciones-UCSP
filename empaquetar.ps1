# Genera el ZIP de entrega para el cliente a partir de lo que está en git (HEAD).
# Solo incluye archivos versionados y excluye los marcados con export-ignore
# en .gitattributes (CLAUDE.md, .gitignore, este script, etc.).
# Uso:  .empaquetar.ps1 [-Version V2]   (el sufijo es opcional)
# Importante: haz commit antes; el ZIP refleja el último commit, no cambios sin guardar.

param([string]$Version = "")

$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

if (git status --porcelain) {
    Write-Warning "Hay cambios sin commitear. El ZIP NO los incluirá."
}

$fecha = Get-Date -Format 'yyyy-MM-dd'
$sufijo = if ($Version) { "_$Version" } else { '' }
$salida = Join-Path $PSScriptRoot "..\colaciones-UCSP_$fecha$sufijo.zip"
git archive --format=zip --output="$salida" HEAD
Write-Host "ZIP creado: $((Resolve-Path $salida).Path)"
