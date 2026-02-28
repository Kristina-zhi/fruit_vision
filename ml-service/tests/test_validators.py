import pytest
from app.utils.detection import DetectionResult


class TestDetectionResult:
    def test_creation(self):
        d = DetectionResult(class_id=0, class_name="apple", confidence=0.95, bbox={"x_min": 0, "y_min": 0, "x_max": 100, "y_max": 100})
        assert d.class_id == 0
        assert d.class_name == "apple"
        assert d.confidence == 0.95
        assert d.bbox["x_min"] == 0

    def test_to_dict(self):
        d = DetectionResult(class_id=1, class_name="banana", confidence=0.88, bbox={"x_min": 10, "y_min": 20, "x_max": 50, "y_max": 80})
        dd = d.__dict__
        assert dd["class_id"] == 1
        assert dd["class_name"] == "banana"
        assert dd["confidence"] == 0.88
        assert dd["bbox"]["x_max"] == 50
