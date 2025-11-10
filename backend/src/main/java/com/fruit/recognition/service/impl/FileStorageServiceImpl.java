package com.fruit.recognition.service.impl;

import com.fruit.recognition.service.FileStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageServiceImpl implements FileStorageService {
    private final Path uploadDir;

    public FileStorageServiceImpl(@Value("${app.upload-dir}") String uploadDir) {
        this.uploadDir = Paths.get(uploadDir).toAbsolutePath().normalize();
        try { Files.createDirectories(this.uploadDir); }
        catch (IOException e) { throw new RuntimeException("Could not create upload directory", e); }
    }

    @Override
    public Path store(MultipartFile file) {
        String originalName = file.getOriginalFilename();
        String ext = "";
        if (originalName != null && originalName.contains(".")) ext = originalName.substring(originalName.lastIndexOf("."));
        String fileName = UUID.randomUUID() + ext;
        Path targetPath = uploadDir.resolve(fileName);
        try { Files.copy(file.getInputStream(), targetPath); return targetPath; }
        catch (IOException e) { throw new RuntimeException("Could not store file " + fileName, e); }
    }

    @Override
    public void delete(String filePath) {
        try { Files.deleteIfExists(Paths.get(filePath)); }
        catch (IOException e) { throw new RuntimeException("Could not delete file " + filePath, e); }
    }
}
