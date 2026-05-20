package com.fruit.recognition.service.impl;

import com.fruit.recognition.dto.FruitInfo;
import com.fruit.recognition.dto.FruitSummaryDto;
import com.fruit.recognition.dto.MineralDto;
import com.fruit.recognition.dto.NutritionInfo;
import com.fruit.recognition.dto.VitaminDto;
import com.fruit.recognition.entity.Fruit;
import com.fruit.recognition.repository.FruitRepository;
import com.fruit.recognition.service.FruitService;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FruitServiceImpl implements FruitService {
    private final FruitRepository fruitRepository;

    public FruitServiceImpl(FruitRepository fruitRepository) {
        this.fruitRepository = fruitRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<FruitInfo> getByName(String name) {
        if (name == null || name.isBlank()) {
            return Optional.empty();
        }
        return fruitRepository.findByNameIgnoreCase(name.trim()).map(this::mapToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FruitSummaryDto> getAll() {
        return fruitRepository.findAll(Sort.by(Sort.Direction.ASC, "name")).stream()
            .map(f -> new FruitSummaryDto(f.getId(), f.getName(), f.getDisplayName(), f.getCalories(), f.getImageUrl()))
            .collect(Collectors.toList());
    }

    private FruitInfo mapToDto(Fruit fruit) {
        List<VitaminDto> vitamins = fruit.getVitamins().stream()
            .map(v -> new VitaminDto(v.getVitaminName(), v.getAmount()))
            .collect(Collectors.toList());

        List<MineralDto> minerals = fruit.getMinerals().stream()
            .map(m -> new MineralDto(m.getMineralName(), m.getAmount()))
            .collect(Collectors.toList());

        NutritionInfo nutrition = fruit.getNutrition() == null
            ? NutritionInfo.empty()
            : new NutritionInfo(
                fruit.getNutrition().getCalories(),
                fruit.getNutrition().getProteins(),
                fruit.getNutrition().getFats(),
                fruit.getNutrition().getCarbohydrates(),
                fruit.getNutrition().getFiber(),
                fruit.getNutrition().getWater());

        return new FruitInfo(
            fruit.getId(),
            fruit.getName(),
            fruit.getDisplayName(),
            fruit.getDescription(),
            fruit.getCalories(),
            fruit.getSeason(),
            fruit.getLocation(),
            fruit.getImageUrl(),
            vitamins,
            minerals,
            nutrition);
    }
}
