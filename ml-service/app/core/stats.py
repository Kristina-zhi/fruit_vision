import time
from dataclasses import dataclass, field
from threading import Lock


@dataclass
class ServiceStats:
    started_at: float = field(default_factory=time.time)
    total_requests: int = 0
    successful_requests: int = 0
    failed_requests: int = 0
    total_detections: int = 0
    _lock: Lock = field(default_factory=Lock, repr=False)

    def record_success(self, detections: int) -> None:
        with self._lock:
            self.total_requests += 1
            self.successful_requests += 1
            self.total_detections += detections

    def record_failure(self) -> None:
        with self._lock:
            self.total_requests += 1
            self.failed_requests += 1

    def snapshot(self) -> dict:
        with self._lock:
            return {
                "uptime_seconds": round(time.time() - self.started_at, 1),
                "total_requests": self.total_requests,
                "successful_requests": self.successful_requests,
                "failed_requests": self.failed_requests,
                "total_detections": self.total_detections,
            }


stats = ServiceStats()
