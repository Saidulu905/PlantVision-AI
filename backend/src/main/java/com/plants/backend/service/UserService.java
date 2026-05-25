package com.plants.backend.service;

import com.plants.backend.dto.AuthResponse;
import com.plants.backend.dto.LoginRequest;
import com.plants.backend.dto.RegisterRequest;
import com.plants.backend.exception.BadRequestException;
import com.plants.backend.model.User;
import com.plants.backend.repository.UserRepository;
import com.plants.backend.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    // Registers a new user.
    public User registerUser(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Email Address already in use!");
        }

        // Default role is ROLE_USER if not specified or empty
        String role = registerRequest.getRole();
        if (role == null || role.trim().isEmpty()) {
            role = "ROLE_USER";
        } else {
            // Standardize role name
            role = role.trim().toUpperCase();
            if (!role.startsWith("ROLE_")) {
                role = "ROLE_" + role;
            }
        }

        User user = User.builder()
                .name(registerRequest.getName())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .role(role)
                .build();

        return userRepository.save(user);
    }

    // Authenticates a user and generates JWT token
    public AuthResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new BadRequestException("User record missing after authentication"));

        return AuthResponse.builder()
                .token(jwt)
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole())
                .build();
    }

    // Resolves standard database user context from their authenticated email/principal
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("No user found with email " + email));
    }
}
