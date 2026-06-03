import time
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from loguru import logger

from app.api.routes import router
from app.core.config import settings
from app.core.exceptions import ServiceError
from app.models.detector import FruitDetector

LOG_DIR = Path(__file__).resolve().parent.parent / "logs"
LOG_DIR.mkdir(parents=True, exist_ok=True)
logger.add(LOG_DIR / "ml_service.log", rotation="10 MB", retention="30 days", encoding="utf-8")


@asynccontextmanager
async def lifespan(app: FastAPI):
    backend_path = Path(settings.BACKEND_FOLDER_PATH)
    backend_path.mkdir(parents=True, exist_ok=True)

    model_path = Path(settings.MODEL_PATH)
    if not model_path.exists():
        logger.warning(f"Model file not found at {settings.MODEL_PATH}, mock mode enabled")
        app.state.detector = None
    else:
        app.state.detector = FruitDetector(str(model_path), settings.CONFIDENCE_THRESHOLD)
        logger.info("Model loaded successfully")

    logger.info(f"Starting ML Service {settings.SERVICE_VERSION}")
    yield
    logger.info("Shutting down ML Service")


app = FastAPI(
    title="Fruit Vision ML Service",
    description="YOLO-based fruit detection service",
    version=settings.SERVICE_VERSION,
    lifespan=lifespan,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    started = time.perf_counter()
    response = await call_next(request)
    elapsed_ms = round((time.perf_counter() - started) * 1000, 1)
    logger.info(f"{request.method} {request.url.path} status={response.status_code} time={elapsed_ms}ms")
    return response


@app.exception_handler(ServiceError)
async def service_error_handler(request: Request, exc: ServiceError):
    if exc.status_code >= 500:
        logger.error(f"{request.method} {request.url.path}: {exc.message}")
    else:
        logger.warning(f"{request.method} {request.url.path}: {exc.message}")
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.message})


app.include_router(router)
