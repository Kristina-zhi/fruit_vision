package com.fruit.recognition.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record VitaminDto(
    @JsonProperty("name") String name,
    @JsonProperty("amount") String amount
) {}
