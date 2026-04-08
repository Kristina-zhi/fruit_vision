package com.fruit.recognition.service.impl;

import com.fruit.recognition.dto.MlResponseDto;
import com.fruit.recognition.service.MlServiceClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import java.io.IOException;
import java.io.InputStream;

@Service
public class MlServiceClientImpl implements MlServiceClient {
    private final String mlServerUrl;
    private final RestTemplate restTemplate;

    public MlServiceClientImpl(@Value("${ml.server.url}") String mlServerUrl, RestTemplate restTemplate) {
        this.mlServerUrl = mlServerUrl;
        this.restTemplate = restTemplate;
    }

    @Override
    public MlResponseDto sendImage(InputStream imageStream, String fileName) {
        try {
            var body = new LinkedMultiValueMap<String, Object>();
            var resource = new ByteArrayResource(imageStream.readAllBytes()) {
                @Override public String getFilename() { return fileName; }
            };
            var filePart = new HttpEntity<>(resource, createFileHeaders(fileName));
            body.add("file", filePart);
            var headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            var requestEntity = new HttpEntity<>(body, headers);
            return restTemplate.postForObject(mlServerUrl + "/predict/all", requestEntity, MlResponseDto.class);
        } catch (IOException e) {
            throw new RuntimeException("Failed to read image stream", e);
        }
    }

    private HttpHeaders createFileHeaders(String fileName) {
        var headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_JPEG);
        headers.setContentDispositionFormData("file", fileName);
        return headers;
    }
}
