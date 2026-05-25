package com.plants.backend.controller;

import com.plants.backend.dto.AuthResponse;
import com.plants.backend.dto.LoginRequest;
import com.plants.backend.dto.RegisterRequest;
import com.plants.backend.model.User;
import com.plants.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    // Register a new user account
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        User registeredUser = userService.registerUser(registerRequest);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "User registered successfully!");
        response.put("userId", registeredUser.getId());
        
        return ResponseEntity.ok(response);
    }

    // Authenticate user and return JWT
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        AuthResponse authResponse = userService.authenticateUser(loginRequest);
        return ResponseEntity.ok(authResponse);
    }

    // Retrieve details of the current logged-in user
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Principal principal, Authentication authentication) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Unauthorized: No session active.");
        }
        
        User user = userService.getUserByEmail(principal.getName());
        
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("role", user.getRole());
        
        return ResponseEntity.ok(response);
    }
}
