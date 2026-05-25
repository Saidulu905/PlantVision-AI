package com.plants.backend.controller;

import com.plants.backend.dto.DeliveryUpdateRequest;
import com.plants.backend.model.Delivery;
import com.plants.backend.model.User;
import com.plants.backend.service.DeliveryService;
import com.plants.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/delivery")
public class DeliveryController {

    @Autowired
    private DeliveryService deliveryService;

    @Autowired
    private UserService userService;

    private User getCurrentUser(Principal principal) {
        return userService.getUserByEmail(principal.getName());
    }

    // Track a delivery status by Order ID (Accessible to owner of order & ADMINs)
    @GetMapping("/track/{orderId}")
    public ResponseEntity<Delivery> trackDelivery(@PathVariable Long orderId, Principal principal) {
        User user = getCurrentUser(principal);
        return ResponseEntity.ok(deliveryService.getDeliveryByOrderId(orderId, user));
    }

    // Fetch all shipments in transit (Protected: ADMIN Only)
    @GetMapping("/admin/all")
    public ResponseEntity<List<Delivery>> getAllDeliveries() {
        return ResponseEntity.ok(deliveryService.getAllDeliveries());
    }

    // Edit delivery stage and details (Protected: ADMIN Only)
    @PutMapping("/admin/update/{id}")
    public ResponseEntity<Delivery> updateDeliveryDetails(
            @PathVariable Long id,
            @Valid @RequestBody DeliveryUpdateRequest updateRequest) {
        
        Delivery updatedDelivery = deliveryService.updateDeliveryDetails(
                id,
                updateRequest.getDeliveryStatus(),
                updateRequest.getEstimatedDate()
        );
        return ResponseEntity.ok(updatedDelivery);
    }
}
