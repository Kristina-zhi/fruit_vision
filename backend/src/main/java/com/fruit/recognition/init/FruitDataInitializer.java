package com.fruit.recognition.init;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
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
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.util.List;

@Component
public class FruitDataInitializer implements CommandLineRunner {
    private static final Logger log = LoggerFactory.getLogger(FruitDataInitializer.class);

    private final FruitRepository fruitRepository;
    private final ObjectMapper objectMapper;

    public FruitDataInitializer(FruitRepository fruitRepository, ObjectMapper objectMapper) {
        this.fruitRepository = fruitRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    @Transactional
    public void run(String... args) {
        long existing = fruitRepository.count();
        if (existing > 0) {
            log.info("Fruit catalog already contains {} entries, initialization skipped", existing);
            return;
        }

        try (InputStream stream = getClass().getResourceAsStream("/fruits.json")) {
            if (stream == null) {
                log.warn("fruits.json not found in resources, catalog stays empty");
                return;
            }

            List<FruitInitData> items = objectMapper.readValue(stream, new TypeReference<>() {});
            for (FruitInitData item : items) {
                fruitRepository.save(mapToEntity(item));
            }
            log.info("Fruit catalog initialized with {} entries", items.size());
        } catch (Exception e) {
            throw new IllegalStateException("Failed to initialize fruit catalog", e);
        }
    }

    private Fruit mapToEntity(FruitInitData data) {
        Fruit fruit = new Fruit();
        fruit.setName(data.name());
        fruit.setDisplayName(data.displayName());
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
