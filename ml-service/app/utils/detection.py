from dataclasses import dataclass, field
from typing import Dict

@dataclass
class DetectionResult:
    class_id: int
    class_name: str
    confidence: float
    bbox: Dict[str, float] = field(default_factory=dict)
    def __init__(self, class_id: int, class_name: str, confidence: float, bbox: Dict[str, float]):
        self.class_id = class_id; self.class_name = class_name; self.confidence = confidence; self.bbox = bbox
