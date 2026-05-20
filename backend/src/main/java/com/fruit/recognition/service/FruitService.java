package com.fruit.recognition.service;

import com.fruit.recognition.dto.FruitInfo;
import com.fruit.recognition.dto.FruitSummaryDto;
import java.util.List;
import java.util.Optional;

public interface FruitService {
    Optional<FruitInfo> getByName(String name);
    List<FruitSummaryDto> getAll();
}
