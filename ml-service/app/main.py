import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger
from app.api import router
from app.core.model import ModelLoader
from app.core.settings import settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Starting ML Service with model: {settings.MODEL_PATH}")
    if not os.path.exists(settings.MODEL_PATH):
        logger.warning(f"Model file not found at {settings.MODEL_PATH}")
        app.state.model_loader = None
    else:
        app.state.model_loader = ModelLoader(settings.MODEL_PATH)
        logger.info("Model loaded successfully")
    yield
    logger.info("Shutting down ML Service")

app = FastAPI(title="Fruit Vision ML Service", description="YOLO-based fruit detection service", version="1.0.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.include_router(router, prefix="")

@app.get("/health")
async def health():
    return {"status": "healthy", "model_loaded": app.state.model_loader is not None}
