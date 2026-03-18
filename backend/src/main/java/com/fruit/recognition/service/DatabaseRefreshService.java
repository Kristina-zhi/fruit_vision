package com.fruit.recognition.service;

import com.fruit.recognition.dto.FruitInitData;
import com.fruit.recognition.dto.MineralInitData;
import com.fruit.recognition.dto.NutritionInitData;
import com.fruit.recognition.dto.VitaminInitData;
import com.fruit.recognition.entity.Fruit;
import com.fruit.recognition.entity.Mineral;
import com.fruit.recognition.entity.Nutrition;
import com.fruit.recognition.entity.Vitamin;
import com.fruit.recognition.repository.FruitRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DatabaseRefreshService {
    private static final Logger log = LoggerFactory.getLogger(DatabaseRefreshService.class);

    private final FruitRepository fruitRepository;

    public DatabaseRefreshService(FruitRepository fruitRepository) {
        this.fruitRepository = fruitRepository;
    }

    @Transactional
    public void refreshDatabase(List<FruitInitData> fruits) {
        if (fruits == null || fruits.isEmpty()) {
            throw new IllegalArgumentException("Fruit list must not be empty");
        }

        log.info("Refreshing fruit catalog with {} entries", fruits.size());
        fruitRepository.deleteAllInBatch();

        for (FruitInitData data : fruits) {
            fruitRepository.save(mapToEntity(data));
        }

        log.info("Fruit catalog refreshed, total entries: {}", fruitRepository.count());
    }

    private Fruit mapToEntity(FruitInitData data) {
        if (data.name() == null || data.name().isBlank()) {
            throw new IllegalArgumentException("Fruit name must not be empty");
        }

        Fruit fruit = new Fruit();
        fruit.setName(data.name().trim().toLowerCase());
        fruit.setDisplayName(data.displayName() != null ? data.displayName() : data.name());
        fruit.setDescription(data.description());
        fruit.setCalories(data.calories());
        fruit.setSeason(data.season());
        fruit.setLocation(data.location());
        fruit.setImageUrl(data.imageUrl());

        if (data.nutrition() != null) {
            NutritionInitData source = data.nutrition();
            Nutrition nutrition = new Nutrition();
            nutrition.setCalories(data.calories() != null ? data.calories() : 0);
            nutrition.setProteins(valueOrZero(source.proteins()));
            nutrition.setFats(valueOrZero(source.fats()));
            nutrition.setCarbohydrates(valueOrZero(source.carbohydrates()));
            nutrition.setFiber(valueOrZero(source.fiber()));
            nutrition.setWater(valueOrZero(source.water()));
            nutrition.setFruit(fruit);
            fruit.setNutrition(nutrition);
        }

        if (data.vitamins() != null) {
            for (VitaminInitData item : data.vitamins()) {
                Vitamin vitamin = new Vitamin();
                vitamin.setVitaminName(item.vitaminName());
                vitamin.setAmount(item.amount());
                vitamin.setFruit(fruit);
                fruit.getVitamins().add(vitamin);
            }
        }

        if (data.minerals() != null) {
            for (MineralInitData item : data.minerals()) {
                Mineral mineral = new Mineral();
                mineral.setMineralName(item.mineralName());
                mineral.setAmount(item.amount());
                mineral.setFruit(fruit);
                fruit.getMinerals().add(mineral);
            }
        }

        return fruit;
    }

    private double valueOrZero(Double value) {
        return value != null ? value : 0.0;
    }
}
