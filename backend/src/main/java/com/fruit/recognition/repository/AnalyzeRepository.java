package com.fruit.recognition.repository;

import com.fruit.recognition.entity.Analyze;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnalyzeRepository extends JpaRepository<Analyze, Long> {
    Page<Analyze> findByUserIdOrderByAnalyzedAtDesc(Long userId, Pageable pageable);
}
