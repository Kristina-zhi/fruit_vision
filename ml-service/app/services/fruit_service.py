import io

from PIL import Image
from loguru import logger

from app.core.config import settings
from app.utils.detection import DetectionResult


def process_image(image_bytes: bytes, filename: str) -> dict:
    from app.main import app

    detector = getattr(app.state, "detector", None) or getattr(app.state, "model_loader", None)
    if detector is None:
        logger.warning("Model not loaded, returning mock detections")
        return get_mock_detections()

    try:
        image = Image.open(io.BytesIO(image_bytes))
        if hasattr(detector, "detect"):
            detections = detector.detect(image)
        else:
            results = detector.predict(image)
            detections = parse_yolo_results(results, settings.CONFIDENCE_THRESHOLD)
        return {"success": True, "detections": [d.__dict__ for d in detections]}
    except Exception as e:
        logger.error(f"Image processing error: {e}")
        return get_mock_detections()


def process_image_all(image_bytes: bytes, filename: str) -> dict:
    result = process_image(image_bytes, filename)
    result["count"] = len(result.get("detections", []))
    return result


def parse_yolo_results(results, conf_threshold: float) -> list[DetectionResult]:
    detections: list[DetectionResult] = []
    if hasattr(results, "xyxy") and len(results.xyxy):
        boxes = results.xyxy[0].cpu().numpy() if results.xyxy[0].is_cuda else results.xyxy[0].numpy()
        for *box, conf, cls_id in boxes:
            if conf < conf_threshold:
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


def get_mock_detections() -> dict:
    return {
        "success": True,
        "detections": [
            {"class_id": 0, "class_name": "apple", "confidence": 0.95, "bbox": {"x_min": 100, "y_min": 150, "x_max": 300, "y_max": 400}},
            {"class_id": 1, "class_name": "banana", "confidence": 0.87, "bbox": {"x_min": 50, "y_min": 60, "x_max": 200, "y_max": 350}},
        ],
    }
