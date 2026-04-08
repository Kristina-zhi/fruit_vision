package com.fruit.recognition.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record FruitSummaryDto(
    @JsonProperty("id") Long id,
    @JsonProperty("name") String name,
    @JsonProperty("display_name") String displayName,
    @JsonProperty("calories") Integer calories,
    @JsonProperty("image_url") String imageUrl
) {}
