package com.fruit.recognition.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record MlDetectionDto(
    @JsonProperty("class_id") Integer classId,
    @JsonProperty("class_name") String className,
    @JsonProperty("confidence") Double confidence,
    @JsonProperty("bbox") BoundingBox bbox
) {}
