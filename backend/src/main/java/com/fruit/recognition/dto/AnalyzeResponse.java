package com.fruit.recognition.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record AnalyzeResponse(
    @JsonProperty("id") Long id,
    @JsonProperty("file_name") String fileName,
    @JsonProperty("file_path") String filePath,
    @JsonProperty("analyzed_at") String analyzedAt,
    @JsonProperty("detections") List<DetectionDto> detections
) {}
