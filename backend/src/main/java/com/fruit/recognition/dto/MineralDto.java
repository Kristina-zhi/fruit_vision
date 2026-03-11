package com.fruit.recognition.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record MineralDto(
    @JsonProperty("name") String name,
    @JsonProperty("amount") String amount
) {}
