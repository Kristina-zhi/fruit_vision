package com.fruit.recognition.service.impl;

import com.fruit.recognition.dto.AnalyzeResponse;
import com.fruit.recognition.dto.BoundingBox;
import com.fruit.recognition.dto.DetectionDto;
import com.fruit.recognition.dto.FruitSummaryDto;
import com.fruit.recognition.dto.HistoryResponse;
import com.fruit.recognition.entity.Analyze;
import com.fruit.recognition.entity.Detection;
import com.fruit.recognition.repository.AnalyzeRepository;
import com.fruit.recognition.service.AnalyzeService;
import com.fruit.recognition.service.FileStorageService;
import com.fruit.recognition.service.FruitService;
import com.fruit.recognition.service.MlServiceClient;
import com.fruit.recognition.service.UserService;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnalyzeServiceImpl implements AnalyzeService {
    private final AnalyzeRepository analyzeRepository;
    private final MlServiceClient mlServiceClient;
    private final FileStorageService fileStorageService;
    private final UserService userService;
    private final FruitService fruitService;
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME.withZone(ZoneId.of("UTC"));

    public AnalyzeServiceImpl(AnalyzeRepository analyzeRepository, MlServiceClient mlServiceClient,
                              FileStorageService fileStorageService, UserService userService,
                              FruitService fruitService) {
        this.analyzeRepository = analyzeRepository;
        this.mlServiceClient = mlServiceClient;
        this.fileStorageService = fileStorageService;
        this.userService = userService;
        this.fruitService = fruitService;
    }

    @Override @Transactional
    public AnalyzeResponse analyze(MultipartFile file) {
        try {
            var storedPath = fileStorageService.store(file);
            var currentUser = userService.getCurrentUser();
            var mlResponse = mlServiceClient.sendImage(file.getInputStream(), file.getOriginalFilename());
            var analyze = new Analyze();
            analyze.setFileName(file.getOriginalFilename());
            analyze.setFilePath(storedPath.toString());
            analyze.setUser(currentUser);
            analyze.setDetections(mlResponse.detections().stream().map(d -> {
                var det = new Detection();
                det.setClassId(d.classId()); det.setClassName(d.className());
                det.setConfidence(d.confidence());
                det.setXMin(d.bbox().xMin()); det.setYMin(d.bbox().yMin());
                det.setXMax(d.bbox().xMax()); det.setYMax(d.bbox().yMax());
                det.setAnalyze(analyze);
                return det;
            }).collect(Collectors.toList()));
            analyze = analyzeRepository.save(analyze);
            return toResponse(analyze);
        } catch (IOException e) {
            throw new RuntimeException("Failed to read uploaded file", e);
        }
    }

    @Override
    public HistoryResponse getHistory(int page, int size) {
        var currentUser = userService.getCurrentUser();
        var analyzePage = analyzeRepository.findByUserIdOrderByAnalyzedAtDesc(currentUser.getId(), PageRequest.of(page, size));
        return new HistoryResponse(analyzePage.getContent().stream().map(this::toResponse).collect(Collectors.toList()),
            analyzePage.getTotalElements(), page, size);
    }

    @Override
    public AnalyzeResponse getById(Long id) {
        return toResponse(analyzeRepository.findById(id).orElseThrow(() -> new RuntimeException("Analyze not found")));
    }

    private AnalyzeResponse toResponse(Analyze analyze) {
        return new AnalyzeResponse(analyze.getId(), analyze.getFileName(), analyze.getFilePath(),
            analyze.getAnalyzedAt().format(FORMATTER),
            analyze.getDetections().stream().map(d -> new DetectionDto(d.getClassId(), d.getClassName(), d.getConfidence(),
                new BoundingBox(d.getXMin(), d.getYMin(), d.getXMax(), d.getYMax()),
                fruitService.getByName(d.getClassName())
                    .map(f -> new FruitSummaryDto(f.id(), f.name(), f.displayName(), f.calories(), f.imageUrl()))
                    .orElse(null))).collect(Collectors.toList()));
    }
}
