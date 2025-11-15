package com.fruit.recognition.controller;

import com.fruit.recognition.dto.AnalyzeResponse;
import com.fruit.recognition.dto.ErrorResponse;
import com.fruit.recognition.dto.HistoryResponse;
import com.fruit.recognition.service.AnalyzeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/analyze")
public class AnalyzeController {
    private final AnalyzeService analyzeService;
    public AnalyzeController(AnalyzeService analyzeService) { this.analyzeService = analyzeService; }

    @Operation(summary = "Analyze a fruit image")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Analysis completed"),
        @ApiResponse(responseCode = "400", description = "Invalid image", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "500", description = "Analysis failed", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AnalyzeResponse> analyze(
            @Parameter(description = "Image file to analyze") @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(analyzeService.analyze(file));
    }

    @Operation(summary = "Get analysis history")
    @GetMapping("/history")
    public ResponseEntity<HistoryResponse> getHistory(@RequestParam(defaultValue = "0") int page,
                                                       @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(analyzeService.getHistory(page, size));
    }

    @Operation(summary = "Get analysis by ID")
    @GetMapping("/{id}")
    public ResponseEntity<AnalyzeResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(analyzeService.getById(id));
    }
}
