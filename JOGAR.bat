@echo off
setlocal
set "GAME_ROOT=%~dp0"
set "GAME_SERVER=%~dp0tools\serve-local-game.ps1"

start "" powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "%GAME_SERVER%" -Root "%GAME_ROOT%"
powershell.exe -NoProfile -Command "$root=(Resolve-Path -LiteralPath $args[0]).Path.TrimEnd('\'); $deadline=(Get-Date).AddSeconds(20); do { foreach ($port in 8765..8784) { try { $served=(Invoke-WebRequest -UseBasicParsing -Uri ('http://127.0.0.1:'+$port+'/__root') -TimeoutSec 1).Content.Trim(); if ($served -eq $root) { Start-Process ('http://127.0.0.1:'+$port+'/'); exit 0 } } catch {} }; Start-Sleep -Milliseconds 300 } while ((Get-Date) -lt $deadline); exit 1" "%GAME_ROOT%" >nul 2>nul
if errorlevel 1 (
  echo Nao foi possivel iniciar o servidor local do jogo. Feche uma instancia antiga e tente novamente.
  pause
)

endlocal
