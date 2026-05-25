package com.plants.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "plants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Plant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Integer stock;

    @Column(name = "image_url", length = 255)
    private String imageUrl;

    @Column(columnDefinition = "TEXT")
    private String benefits;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
}
