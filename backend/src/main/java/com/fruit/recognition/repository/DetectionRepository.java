package com.fruit.recognition.repository;

import com.fruit.recognition.entity.Detection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DetectionRepository extends JpaRepository<Detection, Long> {
    List<Detection> findByAnalyzeId(Long analyzeId);
}
