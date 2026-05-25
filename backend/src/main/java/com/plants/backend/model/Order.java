package com.plants.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "total_price", nullable = false)
    private Double totalPrice;

    @Column(name = "order_status", nullable = false, length = 50)
    private String orderStatus; // "Ordered", "Packed", "Shipped", "Out for Delivery", "Delivered"

    @Column(name = "created_at", insertable = false, updatable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;

    // Custom field to capture immutable history of what was purchased (e.g. "2x Rose, 1x Mint")
    @Column(name = "items_summary", columnDefinition = "TEXT")
    private String itemsSummary;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
