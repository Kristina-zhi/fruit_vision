package com.fruit.recognition.service.impl;

import com.fruit.recognition.dto.MlResponseDto;
import com.fruit.recognition.service.MlServiceClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
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
        var builder = new MultipartBodyBuilder();
        builder.part("file", new InputStreamResource(imageStream)).filename(fileName).contentType(MediaType.IMAGE_JPEG);
        var headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        var requestEntity = new HttpEntity<MultiValueMap<String, HttpEntity<?>>>(builder.build(), headers);
        return restTemplate.postForObject(mlServerUrl + "/predict", requestEntity, MlResponseDto.class);
    }
}
