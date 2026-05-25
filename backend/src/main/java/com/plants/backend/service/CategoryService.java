package com.plants.backend.service;

import com.plants.backend.model.Category;
import com.plants.backend.repository.CategoryRepository;
import com.plants.backend.exception.ResourceNotFoundException;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    // Automatically initializes the 4 required plant categories at application startup if the database is empty
    @PostConstruct
    public void initDefaultCategories() {
        if (categoryRepository.count() == 0) {
            List<String> defaultCategories = Arrays.asList(
                    "Flower Plants",
                    "Fruit Plants",
                    "Decoration Plants",
                    "Medicinal Plants"
            );

            for (String categoryName : defaultCategories) {
                categoryRepository.save(
                        Category.builder().name(categoryName).build()
                );
            }
            System.out.println(">>> Initialized 4 default plant categories successfully!");
        }
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
    }

    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    public void deleteCategory(Long id) {
        Category category = getCategoryById(id);
        categoryRepository.delete(category);
    }
}
