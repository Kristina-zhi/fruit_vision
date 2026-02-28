import pytest
import time
import statistics
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


class TestPerformance:
    def test_single_request_latency(self, sample_image_paths):
        with open(sample_image_paths["avocado"], "rb") as f:
            start = time.perf_counter()
            response = client.post("/predict", files={"file": ("avocado.jpg", f, "image/jpeg")})
            elapsed = time.perf_counter() - start

        assert response.status_code == 200
        print(f"\nResponse time: {elapsed * 1000:.0f}ms")

    def test_multiple_requests(self, sample_image_paths):
        times = []
        for i in range(5):
            with open(sample_image_paths["avocado"], "rb") as f:
                start = time.perf_counter()
                response = client.post("/predict", files={"file": ("avocado.jpg", f, "image/jpeg")})
                elapsed = time.perf_counter() - start
                times.append(elapsed)
                assert response.status_code == 200

        avg_time = statistics.mean(times)
        print(f"\nAverage response time: {avg_time * 1000:.0f}ms")
        print(f"   Min: {min(times) * 1000:.0f}ms")
        print(f"   Max: {max(times) * 1000:.0f}ms")
