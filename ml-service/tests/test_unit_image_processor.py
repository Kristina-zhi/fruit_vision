import pytest
from app.services.image_processor import get_mock_detections


class TestGetMockDetections:
    def test_returns_dict(self):
        result = get_mock_detections()
        assert isinstance(result, dict)

    def test_has_success_key(self):
        result = get_mock_detections()
        assert result["success"] is True

    def test_has_detections_list(self):
        result = get_mock_detections()
        assert isinstance(result["detections"], list)
        assert len(result["detections"]) == 2

    def test_detection_structure(self):
        result = get_mock_detections()
        for d in result["detections"]:
            assert "class_id" in d
            assert "class_name" in d
            assert "confidence" in d
            assert "bbox" in d
            assert "x_min" in d["bbox"]
            assert "y_min" in d["bbox"]
            assert "x_max" in d["bbox"]
            assert "y_max" in d["bbox"]

    def test_confidence_range(self):
        result = get_mock_detections()
        for d in result["detections"]:
            assert 0 <= d["confidence"] <= 1
