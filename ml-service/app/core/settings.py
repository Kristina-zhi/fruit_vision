from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os

load_dotenv()

class Settings(BaseSettings):
    MODEL_PATH: str = os.getenv("MODEL_PATH", "./best.pt")
    BACKEND_FOLDER_PATH: str = os.getenv("BACKEND_FOLDER_PATH", "../backend/uploads")
    CONFIDENCE_THRESHOLD: float = float(os.getenv("CONFIDENCE_THRESHOLD", "0.25"))
    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
