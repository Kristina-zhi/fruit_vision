package com.fruit.recognition.service;

import com.fruit.recognition.dto.MlResponseDto;
import java.io.InputStream;

public interface MlServiceClient {
    MlResponseDto sendImage(InputStream imageStream, String fileName);
}
