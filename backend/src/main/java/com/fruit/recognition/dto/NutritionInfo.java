package com.fruit.recognition.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record NutritionInfo(
    @JsonProperty("calories") Integer calories,
    @JsonProperty("proteins") Double proteins,
    @JsonProperty("fats") Double fats,
    @JsonProperty("carbohydrates") Double carbohydrates,
    @JsonProperty("fiber") Double fiber,
    @JsonProperty("water") Double water
) {
    public static NutritionInfo empty() {
        return new NutritionInfo(0, 0.0, 0.0, 0.0, 0.0, 0.0);
    }
}
