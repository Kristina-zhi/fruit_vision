Аспекты тестирования API распознавания фруктов

1. Обзор тестирования
Аспект	Описание
Цель	Обеспечение корректной работы API для распознавания фруктов на изображениях
Типы тестов	Интеграционные, модульные, перформанс
Инструменты	pytest, FastAPI TestClient, unittest.mock
Всего тестов	48 (46 без performance)

2. Функциональное тестирование
2.1 Эндпоинт /api/analyze (один фрукт)
TC ID	Название	Проверяемый сценарий
TC-01	avocado.jpg	Успешное распознавание авокадо
TC-02	banana_coconut.jpg	Распознавание при нескольких фруктах на изображении
TC-03	banana-black-white.jpg	Работа с черно-белым изображением
TC-04	no_fruits.jpg	Корректная обработка изображения без фруктов
TC-05	missing_file	Обработка несуществующего файла → 404
TC-06	empty_path	Отклонение пустого пути → 422
TC-07	path_traversal	Блокировка path traversal атак → 400/422
TC-08	invalid_format	Валидация формата запроса → 422
TC-09	unsupported_format	Подача .txt файла → 400 + "Invalid image format"
Ожидаемая структура ответа (200 OK):
{ 
"success": true, 
"message": "string", 
"detectedFruit": 
{ 	"name": "string", 
	"confidence": float, 
	"x": int, 
	"y": int, 
	"width": int, 
	"height": int 
} 
}
2.2 Эндпоинт /api/analyze_all_fruits (все фрукты)
TC ID	Название	Проверяемый сценарий
TC-10	banana_coconut.jpg	Возврат массива объектов (несколько фруктов)
TC-11	avocado.jpg	Возврат массива даже при 1 фрукте
TC-12	no_fruits.jpg	Возврат пустого массива при отсутствии фруктов
TC-13	compare_both	Сравнение работы обоих эндпоинтов на одном изображении
Ожидаемая структура ответа (200 OK):
{ 
"success": true, 
"message": "string", 
"detectedFruits": [
{ 	"name": "string", 
	"confidence": float, 
	"x": int, 
	"y": int, 
	"width": int, 
	"height": int 
} ]
}

3. Модульное тестирование
3.1 Валидация изображений (app/utils/validators.py)
TC ID	Название	Проверяемый сценарий
UT-01	valid_format_jpg	Валидный формат .jpg → "jpg"
UT-02	valid_format_jpeg	Валидный формат .jpeg → "jpeg"
UT-03	valid_format_png	Валидный формат .png → "png"
UT-04	invalid_format	Невалидный формат → ValueError
UT-05	uppercase_format	Формат .JPG → "jpg"
UT-06	size_within_limit	Размер в пределах MAX_IMAGE_SIZE → OK
UT-07	size_exceeds_limit	Размер превышает MAX_IMAGE_SIZE → ValueError
UT-08	valid_image	Корректное изображение → (img, width, height)
UT-09	corrupted_image	Повреждённое изображение → ValueError
UT-10	image_too_small	Изображение меньше 100×100 → ValueError
3.2 Функция validate_file_path
TC ID	Название	Проверяемый сценарий
UT-11	valid_path	Валидный путь к существующему файлу
UT-12	empty_path	Пустой путь → HTTP 422
UT-13	whitespace_only	Путь из пробелов → HTTP 422
UT-14	unsupported_format	Расширение .txt → InvalidImageError
UT-15	path_traversal	Обнаружение path traversal атак → 400/422
UT-16	nonexistent_file	Несуществующий файл → HTTP 404
UT-17	valid_with_spaces	Путь с пробелами обрабатывается корректно
3.3 Функция analyze
TC ID	Название	Проверяемый сценарий
UT-18	no_fruits	Изображение без фруктов → success=false
UT-19	fruit_detected	Успешное распознавание фрукта → корректные координаты
3.4 Функция analyze_all_fruits
TC ID	Название	Проверяемый сценарий
UT-20	no_fruits_all	Изображение без фруктов → пустой массив
UT-21	multiple_fruits	Обнаружение нескольких фруктов → массив из 2+ элементов

4. Тестирование качества данных
TC ID	Название	Проверяемый аспект
TC-14	no_500_errors	Ни одно из тестовых изображений не вызывает ошибку 500
TC-15	response_structure	Структура ответа корректна для всех изображений
TC-16	confidence_range	Confidence в диапазоне [0, 1]
TC-17	bbox_valid	Координаты bounding box неотрицательные
TC-18	session_id	sessionId корректно передаётся через систему

5. Тестирование производительности
TC ID	Название	Измеряемый параметр	Целевое значение
PT-01	single_request	Латентность запроса avocado.jpg	< 2000 мс (рекомендуется)
PT-02	multiple_requests	Среднее время 5 последовательных запросов	< 2000 мс в среднем
Метрики для сбора:
•	Минимальное время ответа
•	Максимальное время ответа
•	Среднее время ответа
•	Стабильность (вариативность времени)

6. Тестовые данные
6.1 Изображения
Файл	Описание	Ожидаемый результат
avocado.jpg	Один фрукт, цветное изображение	Обнаружение авокадо
banana_coconut.jpg	Несколько фруктов на изображении	Обнаружение банана и кокоса
banana-black-white.jpg	Черно-белое изображение	Обнаружение банана
no_fruits.jpg	Изображение без фруктов	success=false или пустой массив
6.2 Тестовые запросы
// Базовый шаблон { "imagePath": "tests/image/avocado.jpg", "sessionId": "test_session_123" }
// Невалидные сценарии { "imagePath": "../../../etc/passwd", "sessionId": "test" } { "imagePath": "", "sessionId": "test" } { "imagePath": "not_exist.jpg", "sessionId": "test" }

7. Граничные случаи
Сценарий	Входные данные	Ожидаемый код ответа
Пустой путь	imagePath: ""	422
Только пробелы	imagePath: " "	422
Отсутствие поля	{} или {"sessionId": "test"}	422
Path traversal	imagePath: "../../../etc/passwd"	400 или 422
Несуществующий файл	imagePath: "no_such_file.jpg"	404
Очень длинный путь	imagePath: "a" * 1000 + ".jpg"	404 или 422
Спецсимволы	imagePath: "test@#$%.jpg"	Обработка без ошибки
Невалидный формат	imagePath: "file.txt"	400 + "Invalid image format"
Повреждённое изображение	Бинарный мусор вместо JPEG	400 + "Corrupted or unreadable"
Слишком маленькое	Изображение < 100×100	400 + "too small"
Превышение MAX_IMAGE_SIZE	Изображение > 10 MB	413

8. Тестовое окружение
Компонент	Значение
Python	3.13+
Фреймворк	FastAPI
Тестовый клиент	TestClient
Модель ML	YOLO (ultralytics)
Файл модели	best.pt (38 MB, корень ml-service/)
Переменные окружения	.env файл с конфигурацией
Корневая директория	tests/ с поддиректорией image/
Конфигурация	app.core.config.Settings (MAX_IMAGE_SIZE, ALLOWED_FORMATS, MIN/MAX размеры)
Исключения	app.core.exceptions (InvalidImageError, ImageSizeExceededError, и др.)
Логирование	Файл logs/ml_service.log + stdout, middleware для замеров времени запросов
9. Запуск тестов
# Все тесты
pytest tests/ -v
# Все тесты без performance
pytest tests/ -v --ignore=tests/test_performance.py
# Только интеграционные
pytest tests/test_integration_api.py -v
# Только модульные (валидаторы + сервис)
pytest tests/test_validators.py tests/test_unit_fruit_service.py -v
# Только валидаторы
pytest tests/test_validators.py -v
# Только производительность
pytest tests/test_performance.py -v
# С подробным выводом времени
pytest tests/test_performance.py -v -s
