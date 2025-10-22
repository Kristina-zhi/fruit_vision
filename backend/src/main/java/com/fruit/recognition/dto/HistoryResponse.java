package com.fruit.recognition.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record HistoryResponse(
    @JsonProperty("items") List<AnalyzeResponse> items,
    @JsonProperty("total") long total,
    @JsonProperty("page") int page,
    @JsonProperty("size") int size
) {}
