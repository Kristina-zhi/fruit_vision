package com.fruit.recognition.repository;

import com.fruit.recognition.entity.Fruit;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface FruitRepository extends JpaRepository<Fruit, Long> {
    @EntityGraph(attributePaths = {"nutrition", "vitamins", "minerals"})
    Optional<Fruit> findByNameIgnoreCase(String name);
    boolean existsByNameIgnoreCase(String name);
}
