package com.fruit.recognition.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record MlResponseDto(
    @JsonProperty("success") boolean success,
    @JsonProperty("detections") List<MlDetectionDto> detections
) {}
