package com.fruit.recognition.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.http.HttpStatus;
import java.time.LocalDateTime;
import java.util.Map;

public record ErrorResponse(
    @JsonProperty("timestamp") LocalDateTime timestamp,
    @JsonProperty("status") int status,
    @JsonProperty("error") String error,
    @JsonProperty("message") String message,
    @JsonProperty("path") String path,
    @JsonProperty("details") Map<String, String> details
) {
    public ErrorResponse(HttpStatus status, String message, String path) {
        this(LocalDateTime.now(), status.value(), status.getReasonPhrase(), message, path, null);
    }
    public ErrorResponse(HttpStatus status, String message, String path, Map<String, String> details) {
        this(LocalDateTime.now(), status.value(), status.getReasonPhrase(), message, path, details);
    }
}
