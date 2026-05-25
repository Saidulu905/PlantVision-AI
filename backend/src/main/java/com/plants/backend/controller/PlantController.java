package com.plants.backend.controller;

import com.plants.backend.dto.PlantDto;
import com.plants.backend.model.Plant;
import com.plants.backend.service.PlantService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plants")
public class PlantController {

    @Autowired
    private PlantService plantService;

    // Fetch all plants (Publicly Accessible)
    @GetMapping
    public ResponseEntity<List<Plant>> getAllPlants() {
        return ResponseEntity.ok(plantService.getAllPlants());
    }

    // Fetch a single plant by its ID (Publicly Accessible)
    @GetMapping("/{id}")
    public ResponseEntity<Plant> getPlantById(@PathVariable Long id) {
        return ResponseEntity.ok(plantService.getPlantById(id));
    }

    // Fetch plants belonging to a category (Publicly Accessible)
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Plant>> getPlantsByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(plantService.getPlantsByCategory(categoryId));
    }

    // Register a new plant listing (Protected: ADMIN Only)
    @PostMapping
    public ResponseEntity<Plant> createPlant(@Valid @RequestBody PlantDto plantDto) {
        return ResponseEntity.ok(plantService.createPlant(plantDto));
    }

    // Update an existing plant listing (Protected: ADMIN Only)
    @PutMapping("/{id}")
    public ResponseEntity<Plant> updatePlant(@PathVariable Long id, @Valid @RequestBody PlantDto plantDto) {
        return ResponseEntity.ok(plantService.updatePlant(id, plantDto));
    }

    // Delete a plant listing (Protected: ADMIN Only)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePlant(@PathVariable Long id) {
        plantService.deletePlant(id);
        return ResponseEntity.ok("Plant with ID " + id + " has been successfully deleted.");
    }
}
