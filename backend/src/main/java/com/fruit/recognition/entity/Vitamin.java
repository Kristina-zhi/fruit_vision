package com.fruit.recognition.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "fruit_vitamins")
public class Vitamin {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fruit_id", nullable = false)
    private Fruit fruit;
    @Column(name = "vitamin_name", nullable = false, length = 150)
    private String vitaminName;
    @Column(nullable = false, length = 50)
    private String amount;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Fruit getFruit() { return fruit; }
    public void setFruit(Fruit fruit) { this.fruit = fruit; }
    public String getVitaminName() { return vitaminName; }
    public void setVitaminName(String vitaminName) { this.vitaminName = vitaminName; }
    public String getAmount() { return amount; }
    public void setAmount(String amount) { this.amount = amount; }
}
