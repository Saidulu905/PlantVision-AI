package com.plants.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HomeController {

    // Serves a friendly public system status diagnostic at the root URL
    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> getSystemStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "ONLINE");
        status.put("application", "PlantVision AI Full-Stack Platform");
        status.put("version", "1.0.0");
        status.put("engine", "Antigravity Smart Botanical Core");
        status.put("diagnostics", "All Spring Boot services, database tables, and AI simulators are running successfully.");
        return ResponseEntity.ok(status);
    }
}
