# Инструкция по запуску ml сервера

1. Установить python версии 3.12.х и выше
2. Создать .env файл по примеру и указать путь к весам модели и директории Backend (папка backend)
3. Запустить launch.bat (Windows) или launch.sh (Linux/macOS), при необходимости отредактировать файл для указания пути к интерпретатору
4. Проверить работу сервиса: `http://localhost:8000/health`

Подробное описание ML-сервиса — в [ml-service/README.md](ml-service/README.md).

[README](README.md)
