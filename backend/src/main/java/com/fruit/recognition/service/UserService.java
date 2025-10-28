package com.fruit.recognition.service;

import com.fruit.recognition.dto.AuthRequest;
import com.fruit.recognition.dto.AuthResponse;
import com.fruit.recognition.entity.User;

public interface UserService {
    AuthResponse register(AuthRequest request);
    AuthResponse login(AuthRequest request);
    AuthResponse refresh(String refreshToken);
    User getCurrentUser();
}
