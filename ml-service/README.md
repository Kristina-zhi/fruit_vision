# ML-сервис Fruit Vision

Сервис распознавания фруктов на изображениях. Принимает изображение, запускает YOLO-модель и возвращает список найденных объектов с координатами ограничивающих рамок.

## Стек

- Python 3.12
- FastAPI + Uvicorn
- PyTorch / YOLOv5
- Pillow, OpenCV, NumPy
- Loguru

## Структура

```text
ml-service/
├── app/
│   ├── api/            # HTTP-эндпоинты
│   ├── core/           # настройки и загрузка модели
│   ├── services/       # обработка изображений
│   ├── utils/          # вспомогательные структуры
│   └── main.py         # точка входа FastAPI
├── Dockerfile
├── requirements.txt
├── launch.bat          # запуск на Windows
└── launch.sh           # запуск на Linux/macOS
```

## Переменные окружения

Создайте файл `.env` в директории `ml-service`:

```env
MODEL_PATH=./best.pt
BACKEND_FOLDER_PATH=../backend/uploads
CONFIDENCE_THRESHOLD=0.25
```

- `MODEL_PATH` — путь к весам модели;
- `BACKEND_FOLDER_PATH` — директория загрузок backend;
- `CONFIDENCE_THRESHOLD` — минимальная уверенность детекции.

## Локальный запуск

Windows:

```bat
launch.bat
```

Linux/macOS:

```bash
chmod +x launch.sh
./launch.sh
```

Или вручную:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## Запуск в Docker

```bash
docker build -t fruit-vision-ml .
docker run --rm -p 8000:8000 --env-file .env -v "$PWD/best.pt:/app/best.pt" fruit-vision-ml
```

## Эндпоинты

- `GET /health` — состояние сервиса и модели;
- `POST /predict` — распознавание фруктов на изображении;
- `POST /predict/all` — распознавание всех найденных фруктов с количеством.

Пример запроса:

```bash
curl -X POST http://localhost:8000/predict -F "file=@fruit.jpg"
```
