package com.fruit.recognition.service.impl;

import com.fruit.recognition.config.jwt.JwtTokenProvider;
import com.fruit.recognition.dto.AuthRequest;
import com.fruit.recognition.dto.AuthResponse;
import com.fruit.recognition.entity.User;
import com.fruit.recognition.entity.enums.Role;
import com.fruit.recognition.repository.UserRepository;
import com.fruit.recognition.service.UserService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder,
                           JwtTokenProvider jwtTokenProvider, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.authenticationManager = authenticationManager;
    }

    @Override
    public AuthResponse register(AuthRequest request) {
        if (userRepository.existsByEmail(request.email()))
            throw new RuntimeException("User with email " + request.email() + " already exists");
        var user = new User();
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(Role.ROLE_USER);
        user = userRepository.save(user);
        return new AuthResponse(jwtTokenProvider.generateAccessToken(user.getEmail()),
            jwtTokenProvider.generateRefreshToken(user.getEmail()), user.getId(), user.getEmail());
    }

    @Override
    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        var user = userRepository.findByEmail(request.email()).orElseThrow(() -> new RuntimeException("User not found"));
        return new AuthResponse(jwtTokenProvider.generateAccessToken(user.getEmail()),
            jwtTokenProvider.generateRefreshToken(user.getEmail()), user.getId(), user.getEmail());
    }

    @Override
    public AuthResponse refresh(String refreshToken) {
        String username = jwtTokenProvider.extractUsername(refreshToken);
        var user = userRepository.findByEmail(username).orElseThrow(() -> new RuntimeException("User not found"));
        return new AuthResponse(jwtTokenProvider.generateAccessToken(user.getEmail()),
            jwtTokenProvider.generateRefreshToken(user.getEmail()), user.getId(), user.getEmail());
    }

    @Override
    public User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) throw new RuntimeException("No authenticated user");
        return userRepository.findByEmail(auth.getName()).orElseThrow(() -> new RuntimeException("User not found"));
    }
}
