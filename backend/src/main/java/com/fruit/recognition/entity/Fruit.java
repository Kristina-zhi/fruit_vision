package com.fruit.recognition.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "fruits")
public class Fruit {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true, length = 100)
    private String name;
    @Column(name = "display_name", nullable = false, length = 150)
    private String displayName;
    @Column(length = 2000)
    private String description;
    private Integer calories;
    @Column(length = 100)
    private String season;
    @Column(length = 300)
    private String location;
    @Column(name = "image_url", length = 1000)
    private String imageUrl;

    @OneToOne(mappedBy = "fruit", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Nutrition nutrition;

    @OneToMany(mappedBy = "fruit", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Vitamin> vitamins = new ArrayList<>();

    @OneToMany(mappedBy = "fruit", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Mineral> minerals = new ArrayList<>();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Integer getCalories() { return calories; }
    public void setCalories(Integer calories) { this.calories = calories; }
    public String getSeason() { return season; }
    public void setSeason(String season) { this.season = season; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public Nutrition getNutrition() { return nutrition; }
    public void setNutrition(Nutrition nutrition) { this.nutrition = nutrition; }
    public List<Vitamin> getVitamins() { return vitamins; }
    public void setVitamins(List<Vitamin> vitamins) { this.vitamins = vitamins; }
    public List<Mineral> getMinerals() { return minerals; }
    public void setMinerals(List<Mineral> minerals) { this.minerals = minerals; }
}
