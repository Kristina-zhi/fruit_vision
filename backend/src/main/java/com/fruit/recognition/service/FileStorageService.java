package com.fruit.recognition.service;

import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Path;

public interface FileStorageService {
    Path store(MultipartFile file);
    void delete(String filePath);
}
