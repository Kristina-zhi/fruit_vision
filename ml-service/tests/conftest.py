import sys
import os
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

os.environ["BACKEND_FOLDER_PATH"] = str(Path(__file__).parent.parent) + "\\"

from dotenv import load_dotenv
env_path = Path(__file__).parent.parent / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path)

import pytest
from fastapi.testclient import TestClient
from app.main import app

TEST_IMAGES_PATH = Path(__file__).parent / "image"

@pytest.fixture(scope="session")
def test_client():
    with TestClient(app) as client:
        yield client

@pytest.fixture
def sample_image_paths():
    return {
        "avocado": str(TEST_IMAGES_PATH / "avocado.jpg"),
        "banana_coconut": str(TEST_IMAGES_PATH / "banana_coconut.jpg"),
        "banana_bw": str(TEST_IMAGES_PATH / "banana-black-white.jpg"),
        "no_fruits": str(TEST_IMAGES_PATH / "no_fruits.jpg"),
    }
