package com.fruit.recognition.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "fruit_minerals")
public class Mineral {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fruit_id", nullable = false)
    private Fruit fruit;
    @Column(name = "mineral_name", nullable = false, length = 150)
    private String mineralName;
    @Column(nullable = false, length = 50)
    private String amount;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Fruit getFruit() { return fruit; }
    public void setFruit(Fruit fruit) { this.fruit = fruit; }
    public String getMineralName() { return mineralName; }
    public void setMineralName(String mineralName) { this.mineralName = mineralName; }
    public String getAmount() { return amount; }
    public void setAmount(String amount) { this.amount = amount; }
}
