package com.fruit.recognition.controller;

import com.fruit.recognition.dto.FruitInitData;
import com.fruit.recognition.service.DatabaseRefreshService;
import io.swagger.v3.oas.annotations.Operation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private static final Logger log = LoggerFactory.getLogger(AdminController.class);

    private final DatabaseRefreshService refreshService;

    public AdminController(DatabaseRefreshService refreshService) {
        this.refreshService = refreshService;
    }

    @Operation(summary = "Reload fruit catalog from JSON payload")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping("/refresh")
    public ResponseEntity<String> refreshDatabase(@RequestBody List<FruitInitData> fruits) {
        log.info("Received catalog refresh request, entries: {}", fruits.size());
        refreshService.refreshDatabase(fruits);
        return ResponseEntity.ok("Database refreshed successfully");
    }
}
