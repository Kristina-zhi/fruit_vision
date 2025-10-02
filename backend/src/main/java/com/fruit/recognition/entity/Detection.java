package com.fruit.recognition.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "detections")
public class Detection {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "class_id", nullable = false)
    private Integer classId;
    @Column(name = "class_name", nullable = false, length = 255)
    private String className;
    @Column(nullable = false)
    private Double confidence;
    @Column(name = "x_min", nullable = false)
    private Double xMin;
    @Column(name = "y_min", nullable = false)
    private Double yMin;
    @Column(name = "x_max", nullable = false)
    private Double xMax;
    @Column(name = "y_max", nullable = false)
    private Double yMax;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "analyze_id", nullable = false)
    private Analyze analyze;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Integer getClassId() { return classId; }
    public void setClassId(Integer classId) { this.classId = classId; }
    public String getClassName() { return className; }
    public void setClassName(String className) { this.className = className; }
    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }
    public Double getXMin() { return xMin; }
    public void setXMin(Double xMin) { this.xMin = xMin; }
    public Double getYMin() { return yMin; }
    public void setYMin(Double yMin) { this.yMin = yMin; }
    public Double getXMax() { return xMax; }
    public void setXMax(Double xMax) { this.xMax = xMax; }
    public Double getYMax() { return yMax; }
    public void setYMax(Double yMax) { this.yMax = yMax; }
    public Analyze getAnalyze() { return analyze; }
    public void setAnalyze(Analyze analyze) { this.analyze = analyze; }
}
