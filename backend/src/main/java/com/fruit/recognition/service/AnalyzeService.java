package com.fruit.recognition.service;

import com.fruit.recognition.dto.AnalyzeResponse;
import com.fruit.recognition.dto.HistoryResponse;
import org.springframework.web.multipart.MultipartFile;

public interface AnalyzeService {
    AnalyzeResponse analyze(MultipartFile file);
    HistoryResponse getHistory(int page, int size);
    AnalyzeResponse getById(Long id);
}
