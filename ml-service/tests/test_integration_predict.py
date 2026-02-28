import pytest


class TestPredictEndpoint:
    endpoint = "/predict"

    def test_predict_with_jpg(self, test_client, sample_image_paths):
        with open(sample_image_paths["avocado"], "rb") as f:
            response = test_client.post(self.endpoint, files={"file": ("avocado.jpg", f, "image/jpeg")})
        assert response.status_code == 200
        data = response.json()
        assert "success" in data
        assert "detections" in data

    def test_predict_with_banana_coconut(self, test_client, sample_image_paths):
        with open(sample_image_paths["banana_coconut"], "rb") as f:
            response = test_client.post(self.endpoint, files={"file": ("banana_coconut.jpg", f, "image/jpeg")})
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data["detections"], list)

    def test_predict_with_black_white(self, test_client, sample_image_paths):
        with open(sample_image_paths["banana_bw"], "rb") as f:
            response = test_client.post(self.endpoint, files={"file": ("banana-black-white.jpg", f, "image/jpeg")})
        assert response.status_code == 200

    def test_predict_with_no_fruits(self, test_client, sample_image_paths):
        with open(sample_image_paths["no_fruits"], "rb") as f:
            response = test_client.post(self.endpoint, files={"file": ("no_fruits.jpg", f, "image/jpeg")})
        assert response.status_code == 200
        data = response.json()
        assert "detections" in data

    def test_predict_rejects_non_image(self, test_client):
        response = test_client.post(self.endpoint, files={"file": ("test.txt", b"not an image", "text/plain")})
        assert response.status_code == 400

    def test_predict_rejects_no_file(self, test_client):
        response = test_client.post(self.endpoint)
        assert response.status_code == 422

    def test_health_endpoint(self, test_client):
        response = test_client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert data["status"] == "healthy"

    @pytest.mark.parametrize("image_path,filename", [
        ("avocado", "avocado.jpg"),
        ("banana_coconut", "banana_coconut.jpg"),
        ("banana_bw", "banana-black-white.jpg"),
        ("no_fruits", "no_fruits.jpg"),
    ])
    def test_all_images_dont_crash(self, test_client, sample_image_paths, image_path, filename):
        with open(sample_image_paths[image_path], "rb") as f:
            response = test_client.post(self.endpoint, files={"file": (filename, f, "image/jpeg")})
        assert response.status_code != 500
