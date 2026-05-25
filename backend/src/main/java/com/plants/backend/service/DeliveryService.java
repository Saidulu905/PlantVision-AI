package com.plants.backend.service;

import com.plants.backend.model.Delivery;
import com.plants.backend.model.Order;
import com.plants.backend.model.User;
import com.plants.backend.repository.DeliveryRepository;
import com.plants.backend.repository.OrderRepository;
import com.plants.backend.exception.ResourceNotFoundException;
import com.plants.backend.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class DeliveryService {

    @Autowired
    private DeliveryRepository deliveryRepository;

    @Autowired
    private OrderRepository orderRepository;

    // Retrieve delivery details by order ID, enforcing customer ownership or ADMIN access
    public Delivery getDeliveryByOrderId(Long orderId, User user) {
        Delivery delivery = deliveryRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("No delivery dispatch found for order id: " + orderId));

        if (!delivery.getOrder().getUser().getId().equals(user.getId()) && !user.getRole().equals("ROLE_ADMIN")) {
            throw new BadRequestException("Access denied: You do not own this tracking profile.");
        }

        return delivery;
    }

    public List<Delivery> getAllDeliveries() {
        return deliveryRepository.findAll();
    }

    // Update dispatch stage and estimate date
    @Transactional
    public Delivery updateDeliveryDetails(Long deliveryId, String status, LocalDate estimatedDate) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery details not found with id: " + deliveryId));

        delivery.setDeliveryStatus(status);
        if (estimatedDate != null) {
            delivery.setEstimatedDate(estimatedDate);
        }

        // Keep parent Order status perfectly in sync
        Order order = delivery.getOrder();
        order.setOrderStatus(status);
        orderRepository.save(order);

        return deliveryRepository.save(delivery);
    }
}
