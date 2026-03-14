package com.weavium.backend.controller;

import com.weavium.backend.entity.UserNode;
import com.weavium.backend.repository.UserNodeRepository;
import com.weavium.backend.security.JwtUtil;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Cookie;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserNodeRepository userNodeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserNodeRepository userNodeRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userNodeRepository = userNodeRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register (@RequestBody RegisterRequest request, HttpServletResponse response) {
        if(userNodeRepository.existsByUsername(request.username())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Username already exists"));
        }
        if (userNodeRepository.existsByEmail(request.email())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Email already exists"));
        }

        UserNode user = new UserNode();
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password())); // Hashing the password

        userNodeRepository.save(user);

        // Generate the token and set cookie
        String token = jwtUtil.generateToken(user.getUsername());
        addJwtCookie(response, token);

        return ResponseEntity.ok(Map.of("message", "User registered successfully", "username", user.getUsername()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletResponse response) {
        Optional<UserNode> userOpt = userNodeRepository.findByUsername(request.username());
        if(userOpt.isPresent() && passwordEncoder.matches(request.password(), userOpt.get().getPasswordHash())) {
            String token = jwtUtil.generateToken(userOpt.get().getUsername());
            addJwtCookie(response, token);
            return ResponseEntity.ok(Map.of("message", "Login succesful", "username", userOpt.get().getUsername()));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid username or password"));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        // Blank cookie that expires immediately
        Cookie cookie = new Cookie("jwt", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(true); // Should be true in production (HTTPS)
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);

        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    private void addJwtCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie("jwt", token);
        cookie.setHttpOnly(true); // Prevents XXS attacks
        cookie.setSecure(true); // Only sent via HTTPS
        cookie.setPath("/"); // Available to all endpoints
        cookie.setMaxAge(7 * 24 * 60 * 60);
        response.addCookie(cookie);
    }

    // Java Records for the JSON bodies.
    public record RegisterRequest(String username, String email, String password) {}
    public record LoginRequest(String username, String password) {}

}
