package com.plants.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlantDto {

    private Long id;

    @NotBlank(message = "Plant name cannot be blank")
    private String name;

    private String description;

    @NotNull(message = "Price cannot be null")
    @Min(value = 0, message = "Price cannot be negative")
    private Double price;

    @NotNull(message = "Stock cannot be null")
    @Min(value = 0, message = "Stock cannot be negative")
    private Integer stock;

    private String imageUrl;

    private String benefits;

    @NotNull(message = "Category ID cannot be null")
    private Long categoryId;
}
