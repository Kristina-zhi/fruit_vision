from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from loguru import logger
from app.services.image_processor import process_image, process_image_all

router = APIRouter()


async def _run_prediction(file: UploadFile, all_fruits: bool) -> JSONResponse:
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    try:
        contents = await file.read()
        result = process_image_all(contents, file.filename) if all_fruits else process_image(contents, file.filename)
        return JSONResponse(content=result)
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/predict")
async def predict(file: UploadFile = File(...)):
    return await _run_prediction(file, all_fruits=False)


@router.post("/predict/all")
async def predict_all(file: UploadFile = File(...)):
    return await _run_prediction(file, all_fruits=True)
