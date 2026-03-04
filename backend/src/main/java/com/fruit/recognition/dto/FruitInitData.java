package com.fruit.recognition.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import java.util.List;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public record FruitInitData(
    String name,
    String displayName,
    String description,
    Integer calories,
    String season,
    String location,
    String imageUrl,
    List<VitaminInitData> vitamins,
    List<MineralInitData> minerals,
    @JsonProperty("fruit_nutrition") NutritionInitData nutrition
) {}
