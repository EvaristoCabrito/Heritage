@echo off
setlocal
set "GAME_ROOT=%~dp0"
set "GAME_SERVER=%~dp0tools\serve-local-game.ps1"

start "" powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "%GAME_SERVER%" -Root "%GAME_ROOT%"
powershell.exe -NoProfile -Command "$deadline=(Get-Date).AddSeconds(15); do { try { $client=New-Object Net.Sockets.TcpClient; $client.Connect('127.0.0.1',8765); $client.Close(); exit 0 } catch { Start-Sleep -Milliseconds 250 } } while ((Get-Date) -lt $deadline); exit 1" >nul 2>nul
start "" "http://127.0.0.1:8765/"

endlocal
