package com.plants.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "delivery")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String address;

    @Column(name = "delivery_status", nullable = false, length = 50)
    private String deliveryStatus; // "Ordered", "Packed", "Shipped", "Out for Delivery", "Delivered"

    @Column(name = "estimated_date")
    private LocalDate estimatedDate;
}
