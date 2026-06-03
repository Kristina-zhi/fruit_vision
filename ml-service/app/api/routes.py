import time

from fastapi import APIRouter, File, UploadFile
from fastapi.responses import JSONResponse
from loguru import logger

from app.core.stats import stats
from app.services.fruit_service import process_image, process_image_all
from app.utils.validators import validate_content_type

router = APIRouter()


async def _run_prediction(file: UploadFile, all_fruits: bool) -> JSONResponse:
    validate_content_type(file.content_type)
    contents = await file.read()
    if not contents:
        return JSONResponse(status_code=400, content={"detail": "Uploaded file is empty"})

    started = time.perf_counter()
    result = process_image_all(contents, file.filename) if all_fruits else process_image(contents, file.filename)
    elapsed_ms = round((time.perf_counter() - started) * 1000, 1)
    stats.record_success(len(result.get("detections", [])))
    logger.info(f"Prediction completed: filename={file.filename} detections={len(result.get('detections', []))} time={elapsed_ms}ms")
    return JSONResponse(content=result)


@router.post("/predict")
async def predict(file: UploadFile = File(...)):
    return await _run_prediction(file, all_fruits=False)


@router.post("/predict/all")
async def predict_all(file: UploadFile = File(...)):
    return await _run_prediction(file, all_fruits=True)


@router.get("/health")
async def health():
    from app.main import app
    from app.core.config import settings

    model_loaded = getattr(app.state, "detector", None) is not None
    return {
        "status": "healthy",
        "model_loaded": model_loaded,
        "version": settings.SERVICE_VERSION,
        "stats": stats.snapshot(),
    }
