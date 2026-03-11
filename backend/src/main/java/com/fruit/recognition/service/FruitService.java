package com.fruit.recognition.service;

import com.fruit.recognition.dto.FruitInfo;
import java.util.Optional;

public interface FruitService {
    Optional<FruitInfo> getByName(String name);
}
