package com.plants.backend.service;

import com.plants.backend.model.*;
import com.plants.backend.repository.OrderRepository;
import com.plants.backend.repository.DeliveryRepository;
import com.plants.backend.exception.BadRequestException;
import com.plants.backend.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private DeliveryRepository deliveryRepository;

    @Autowired
    private CartService cartService;

    @Autowired
    private PlantService plantService;

    // Orchestrates transactional checkout: inventory checks -> stock deduction -> order logging -> delivery initialization -> cart wipeout
    @Transactional
    public Order checkout(User user, String address) {
        if (address == null || address.trim().isEmpty()) {
            throw new BadRequestException("Shipping address is required.");
        }

        List<CartItem> cartItems = cartService.getCartForUser(user);
        if (cartItems.isEmpty()) {
            throw new BadRequestException("Cannot checkout: Shopping cart is empty.");
        }

        double totalPrice = 0.0;

        // Verify stock levels and calculate total price
        for (CartItem item : cartItems) {
            Plant plant = item.getPlant();
            if (plant.getStock() < item.getQuantity()) {
                throw new BadRequestException("Insufficient stock for " + plant.getName() + ". Remaining: " + plant.getStock());
            }
            totalPrice += plant.getPrice() * item.getQuantity();
        }

        // Build item summary string for immutable record-keeping
        String itemsSummary = cartItems.stream()
                .map(item -> item.getQuantity() + "x " + item.getPlant().getName() + " ($" + item.getPlant().getPrice() + " each)")
                .collect(Collectors.joining(", "));

        // Deduct inventory levels
        for (CartItem item : cartItems) {
            plantService.decreaseStock(item.getPlant().getId(), item.getQuantity());
        }

        // 1. Save the Order
        Order order = Order.builder()
                .user(user)
                .totalPrice(totalPrice)
                .orderStatus("Ordered")
                .itemsSummary(itemsSummary)
                .build();
        Order savedOrder = orderRepository.save(order);

        // 2. Initialize the Delivery tracking record
        Delivery delivery = Delivery.builder()
                .order(savedOrder)
                .address(address)
                .deliveryStatus("Ordered")
                .estimatedDate(LocalDate.now().plusDays(5)) // standard 5 days ETA
                .build();
        deliveryRepository.save(delivery);

        // 3. Clear the user's shopping cart
        cartService.clearCart(user);

        return savedOrder;
    }

    public List<Order> getUserOrders(User user) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    public Order getOrderById(Long orderId, User user) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        // Enforce ownership: users can only view their own orders, Admins can view any order
        if (!order.getUser().getId().equals(user.getId()) && !user.getRole().equals("ROLE_ADMIN")) {
            throw new BadRequestException("Access denied: You do not own this order.");
        }

        return order;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // Adjust order status (e.g. from "Ordered" to "Packed", "Shipped", etc.)
    @Transactional
    public Order updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        
        order.setOrderStatus(status);
        
        // Synchronize delivery status automatically
        deliveryRepository.findByOrderId(orderId).ifPresent(delivery -> {
            delivery.setDeliveryStatus(status);
            deliveryRepository.save(delivery);
        });

        return orderRepository.save(order);
    }
}
