package com.plants.backend.service;

import com.plants.backend.dto.PlantDto;
import com.plants.backend.exception.BadRequestException;
import com.plants.backend.exception.ResourceNotFoundException;
import com.plants.backend.model.Category;
import com.plants.backend.model.Plant;
import com.plants.backend.repository.PlantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.PostConstruct;
import java.util.List;

@Service
public class PlantService {

    @Autowired
    private PlantRepository plantRepository;

    @Autowired
    private CategoryService categoryService;

    @PostConstruct
    @Transactional
    public void initDefaultPlants() {

        if (plantRepository.count() == 0) {

            categoryService.initDefaultCategories();

            List<Category> categories = categoryService.getAllCategories();

            Category flowerCat = categories.stream()
                    .filter(c -> c.getName().equalsIgnoreCase("Flower Plants"))
                    .findFirst()
                    .orElse(null);

            Category fruitCat = categories.stream()
                    .filter(c -> c.getName().equalsIgnoreCase("Fruit Plants"))
                    .findFirst()
                    .orElse(null);

            Category decCat = categories.stream()
                    .filter(c -> c.getName().equalsIgnoreCase("Decoration Plants"))
                    .findFirst()
                    .orElse(null);

            Category medCat = categories.stream()
                    .filter(c -> c.getName().equalsIgnoreCase("Medicinal Plants"))
                    .findFirst()
                    .orElse(null);

            plantRepository.save(Plant.builder()
                    .name("Aloe Vera")
                    .description("Healing succulent plant.")
                    .price(12.99)
                    .stock(50)
                    .imageUrl("https://images.unsplash.com/photo-1596547609652-9cf5d8d76921")
                    .benefits("Good for skin and burns.")
                    .category(medCat)
                    .build());

            plantRepository.save(Plant.builder()
                    .name("Red Rose")
                    .description("Beautiful flowering plant.")
                    .price(15.99)
                    .stock(30)
                    .imageUrl("https://images.unsplash.com/photo-1518709268805-4e9042af9f23")
                    .benefits("Adds beauty and fragrance.")
                    .category(flowerCat)
                    .build());

            plantRepository.save(Plant.builder()
                    .name("Lavender")
                    .description("Purple aromatic flower.")
                    .price(14.99)
                    .stock(25)
                    .imageUrl("https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a")
                    .benefits("Reduces stress and improves sleep.")
                    .category(flowerCat)
                    .build());

            plantRepository.save(Plant.builder()
                    .name("Tulsi")
                    .description("Holy basil medicinal herb.")
                    .price(9.99)
                    .stock(40)
                    .imageUrl("https://images.unsplash.com/photo-1615485290382-441e4d049cb5")
                    .benefits("Boosts immunity.")
                    .category(medCat)
                    .build());

            plantRepository.save(Plant.builder()
                    .name("Snake Plant")
                    .description("Indoor air purifier.")
                    .price(19.99)
                    .stock(60)
                    .imageUrl("https://images.unsplash.com/photo-1599599810769-bcde5a160d32")
                    .benefits("Purifies indoor air.")
                    .category(decCat)
                    .build());

            plantRepository.save(Plant.builder()
                    .name("Monstera")
                    .description("Large leaf indoor plant.")
                    .price(24.99)
                    .stock(20)
                    .imageUrl("https://images.unsplash.com/photo-1545249390-6bdfa286032f")
                    .benefits("Stylish home decoration.")
                    .category(decCat)
                    .build());

            plantRepository.save(Plant.builder()
                    .name("Lucky Bamboo")
                    .description("Popular indoor bamboo.")
                    .price(11.99)
                    .stock(35)
                    .imageUrl("https://images.unsplash.com/photo-1497250681960-ef046c08a56e")
                    .benefits("Brings luck and positivity.")
                    .category(decCat)
                    .build());

            plantRepository.save(Plant.builder()
                    .name("Bonsai")
                    .description("Miniature decorative tree.")
                    .price(39.99)
                    .stock(10)
                    .imageUrl("https://images.unsplash.com/photo-1470163395405-d2b80e7450ed")
                    .benefits("Beautiful zen decoration.")
                    .category(decCat)
                    .build());

            plantRepository.save(Plant.builder()
                    .name("Sunflower")
                    .description("Bright yellow flower.")
                    .price(10.99)
                    .stock(45)
                    .imageUrl("https://images.unsplash.com/photo-1506744038136-46273834b3fb")
                    .benefits("Enhances garden beauty.")
                    .category(flowerCat)
                    .build());

            plantRepository.save(Plant.builder()
                    .name("Jasmine")
                    .description("Fragrant white flower.")
                    .price(13.99)
                    .stock(30)
                    .imageUrl("https://images.unsplash.com/photo-1501004318641-b39e6451bec6")
                    .benefits("Pleasant aroma.")
                    .category(flowerCat)
                    .build());

            plantRepository.save(Plant.builder()
                    .name("Cherry Tomato")
                    .description("Sweet tomato plant.")
                    .price(9.99)
                    .stock(35)
                    .imageUrl("https://images.unsplash.com/photo-1592417817098-8f3d6eb19675")
                    .benefits("Rich in vitamins.")
                    .category(fruitCat)
                    .build());

            plantRepository.save(Plant.builder()
                    .name("Mango Plant")
                    .description("Tropical fruit tree.")
                    .price(29.99)
                    .stock(15)
                    .imageUrl("https://images.unsplash.com/photo-1553279768-865429fa0078")
                    .benefits("Produces sweet mangoes.")
                    .category(fruitCat)
                    .build());

            plantRepository.save(Plant.builder()
                    .name("Lemon Plant")
                    .description("Citrus fruit plant.")
                    .price(18.99)
                    .stock(22)
                    .imageUrl("https://images.unsplash.com/photo-1582284540020-8acbe03f4924")
                    .benefits("Rich in Vitamin C.")
                    .category(fruitCat)
                    .build());

            plantRepository.save(Plant.builder()
                    .name("Strawberry Plant")
                    .description("Berry fruit plant.")
                    .price(16.99)
                    .stock(28)
                    .imageUrl("https://images.unsplash.com/photo-1464965911861-746a04b4bca6")
                    .benefits("Produces juicy strawberries.")
                    .category(fruitCat)
                    .build());

            plantRepository.save(Plant.builder()
                    .name("Mint")
                    .description("Refreshing herbal plant.")
                    .price(7.99)
                    .stock(50)
                    .imageUrl("https://images.unsplash.com/photo-1603052875302-d376b7c0638a")
                    .benefits("Good for digestion.")
                    .category(medCat)
                    .build());

            System.out.println(">>> Initialized 15 default plant products successfully!");
        }
    }

    public List<Plant> getAllPlants() {
        return plantRepository.findAll();
    }

    public Plant getPlantById(Long id) {
        return plantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plant not found with id: " + id));
    }

    public List<Plant> getPlantsByCategory(Long categoryId) {
        return plantRepository.findByCategoryId(categoryId);
    }

    @Transactional
    public Plant createPlant(PlantDto plantDto) {

        Category category = categoryService.getCategoryById(plantDto.getCategoryId());

        Plant plant = Plant.builder()
                .name(plantDto.getName())
                .description(plantDto.getDescription())
                .price(plantDto.getPrice())
                .stock(plantDto.getStock())
                .imageUrl(plantDto.getImageUrl())
                .benefits(plantDto.getBenefits())
                .category(category)
                .build();

        return plantRepository.save(plant);
    }

    @Transactional
    public Plant updatePlant(Long id, PlantDto plantDto) {

        Plant plant = getPlantById(id);

        Category category = categoryService.getCategoryById(plantDto.getCategoryId());

        plant.setName(plantDto.getName());
        plant.setDescription(plantDto.getDescription());
        plant.setPrice(plantDto.getPrice());
        plant.setStock(plantDto.getStock());
        plant.setImageUrl(plantDto.getImageUrl());
        plant.setBenefits(plantDto.getBenefits());
        plant.setCategory(category);

        return plantRepository.save(plant);
    }

    @Transactional
    public void deletePlant(Long id) {

        Plant plant = getPlantById(id);

        plantRepository.delete(plant);
    }

    @Transactional
    public void decreaseStock(Long plantId, Integer quantity) {

        Plant plant = getPlantById(plantId);

        if (plant.getStock() < quantity) {
            throw new BadRequestException(
                    "Insufficient stock for plant: " + plant.getName()
            );
        }

        plant.setStock(plant.getStock() - quantity);

        plantRepository.save(plant);
    }
}