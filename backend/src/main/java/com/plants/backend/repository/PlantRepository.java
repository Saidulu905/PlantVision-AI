package com.plants.backend.repository;

import com.plants.backend.model.Plant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PlantRepository extends JpaRepository<Plant, Long> {
    List<Plant> findByCategoryId(Long categoryId);
}
