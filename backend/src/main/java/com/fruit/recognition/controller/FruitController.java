package com.fruit.recognition.controller;

import com.fruit.recognition.dto.ErrorResponse;
import com.fruit.recognition.dto.FruitInfo;
import com.fruit.recognition.service.FruitService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/fruits")
public class FruitController {
    private final FruitService fruitService;

    public FruitController(FruitService fruitService) {
        this.fruitService = fruitService;
    }

    @Operation(summary = "Get fruit info by name")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Fruit found"),
        @ApiResponse(responseCode = "404", description = "Fruit not found", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/{name}")
    public ResponseEntity<FruitInfo> getByName(@PathVariable String name) {
        return fruitService.getByName(name)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
