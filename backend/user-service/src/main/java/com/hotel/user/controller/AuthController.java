package com.hotel.user.controller;

import com.hotel.user.model.User;
import com.hotel.user.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@Validated @RequestBody User user) {
        user.setRole("GUEST");
        // NOTE: This is a prototype; passwords are stored in plain text.
        User saved = userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody User request) {
        return userRepository.findByUsername(request.getUsername())
                .filter(u -> u.getPassword().equals(request.getPassword()))
                .map(u -> {
                    Map<String, String> response = new HashMap<>();
                    response.put("token", "mock-jwt-token-for-" + u.getUsername());
                    response.put("role", u.getRole());
                    response.put("userId", u.getId().toString());
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }
}
