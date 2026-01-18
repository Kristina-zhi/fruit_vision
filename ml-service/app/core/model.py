import torch
from loguru import logger

class ModelLoader:
    def __init__(self, model_path: str):
        self.model_path = model_path
        self.model = self._load_model()

    def _load_model(self):
        try:
            model = torch.hub.load("ultralytics/yolov5", "custom", path=self.model_path, force_reload=False)
            model.eval()
            logger.info(f"Model loaded from {self.model_path}")
            return model
        except Exception as e:
            logger.error(f"Failed to load model: {e}")
            raise

    def predict(self, img):
        if self.model is None: raise RuntimeError("Model not loaded")
        return self.model(img)
