import torch
from loguru import logger
from app.utils.detection import DetectionResult


class FruitDetector:
    def __init__(self, model_path: str, confidence_threshold: float = 0.25):
        self.model_path = model_path
        self.confidence_threshold = confidence_threshold
        self.model = self._load_model()
        self.labels = self._read_labels()

    def _load_model(self):
        try:
            model = torch.hub.load("ultralytics/yolov5", "custom", path=self.model_path, force_reload=False)
            model.eval()
            logger.info(f"Model loaded from {self.model_path}")
            return model
        except Exception as e:
            logger.error(f"Failed to load model: {e}")
            raise

    def _read_labels(self) -> list[str]:
        names = getattr(self.model, "names", [])
        return list(names.values()) if isinstance(names, dict) else list(names)

    def detect(self, image) -> list[DetectionResult]:
        if self.model is None:
            raise RuntimeError("Model not loaded")

        results = self.model(image)
        detections: list[DetectionResult] = []
        if not hasattr(results, "xyxy") or not len(results.xyxy):
            return detections

        boxes = results.xyxy[0].cpu().numpy() if results.xyxy[0].is_cuda else results.xyxy[0].numpy()
        for *box, conf, cls_id in boxes:
            if float(conf) < self.confidence_threshold:
                continue
            x1, y1, x2, y2 = box
            detections.append(
                DetectionResult(
                    class_id=int(cls_id),
                    class_name=results.names[int(cls_id)],
                    confidence=float(conf),
                    bbox={"x_min": float(x1), "y_min": float(y1), "x_max": float(x2), "y_max": float(y2)},
                )
            )
        return detections
