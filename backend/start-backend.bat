@echo off
echo ========================================
echo    🚀 NERDVAERKET BACKEND SERVER 🚀
echo ========================================
echo.

echo 📂 Går til backend mappe...
cd backend

echo.
echo 🐍 Starter Python backend server...
echo    Server kører på: http://localhost:8001
echo    Tryk Ctrl+C for at stoppe
echo.

python -m pip install -r requirements.txt
python server.py

pause