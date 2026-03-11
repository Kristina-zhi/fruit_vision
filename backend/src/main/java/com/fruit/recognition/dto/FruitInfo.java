package com.fruit.recognition.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record FruitInfo(
    @JsonProperty("id") Long id,
    @JsonProperty("name") String name,
    @JsonProperty("display_name") String displayName,
    @JsonProperty("description") String description,
    @JsonProperty("calories") Integer calories,
    @JsonProperty("season") String season,
    @JsonProperty("location") String location,
    @JsonProperty("image_url") String imageUrl,
    @JsonProperty("vitamins") List<VitaminDto> vitamins,
    @JsonProperty("minerals") List<MineralDto> minerals,
    @JsonProperty("nutrition") NutritionInfo nutrition
) {}
