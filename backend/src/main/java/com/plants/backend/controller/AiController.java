package com.plants.backend.controller;

import com.plants.backend.service.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    @Autowired
    private AiService aiService;

    // Upload plant image and return AI classification results
    @PostMapping("/detect")
    public ResponseEntity<?> detectPlant(@RequestParam("image") MultipartFile file) {
        return ResponseEntity.ok(aiService.identifyPlant(file));
    }

    // Interactive conversational botanical chatbot chat endpoint
    @PostMapping("/chat")
    public ResponseEntity<?> chatWithBotanist(@RequestBody Map<String, String> payload) {
        return ResponseEntity.ok(aiService.chatWithBotanist(payload));
    }
}
