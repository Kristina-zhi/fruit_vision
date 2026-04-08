package com.fruit.recognition.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record DetectionDto(
    @JsonProperty("class_id") Integer classId,
    @JsonProperty("class_name") String className,
    @JsonProperty("confidence") Double confidence,
    @JsonProperty("bbox") BoundingBox bbox,
    @JsonProperty("fruit") FruitSummaryDto fruit
) {}
