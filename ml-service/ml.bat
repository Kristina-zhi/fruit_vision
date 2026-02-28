@echo off
chcp 65001 > nul
title Fruit Vision ML Service
echo Loading model and starting server...
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
pause
