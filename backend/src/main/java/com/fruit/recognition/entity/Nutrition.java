package com.fruit.recognition.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "fruit_nutrition")
public class Nutrition {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fruit_id", nullable = false, unique = true)
    private Fruit fruit;
    @Column(nullable = false)
    private Integer calories;
    @Column(nullable = false)
    private Double proteins;
    @Column(nullable = false)
    private Double fats;
    @Column(nullable = false)
    private Double carbohydrates;
    @Column(nullable = false)
    private Double fiber;
    @Column(nullable = false)
    private Double water;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Fruit getFruit() { return fruit; }
    public void setFruit(Fruit fruit) { this.fruit = fruit; }
    public Integer getCalories() { return calories; }
    public void setCalories(Integer calories) { this.calories = calories; }
    public Double getProteins() { return proteins; }
    public void setProteins(Double proteins) { this.proteins = proteins; }
    public Double getFats() { return fats; }
    public void setFats(Double fats) { this.fats = fats; }
    public Double getCarbohydrates() { return carbohydrates; }
    public void setCarbohydrates(Double carbohydrates) { this.carbohydrates = carbohydrates; }
    public Double getFiber() { return fiber; }
    public void setFiber(Double fiber) { this.fiber = fiber; }
    public Double getWater() { return water; }
    public void setWater(Double water) { this.water = water; }
}
