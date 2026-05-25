package com.plants.backend.controller;

import com.plants.backend.model.Order;
import com.plants.backend.model.User;
import com.plants.backend.service.OrderService;
import com.plants.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    private User getCurrentUser(Principal principal) {
        return userService.getUserByEmail(principal.getName());
    }

    // Submit cart checkout (Takes a JSON with {"address": "..."})
    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestBody Map<String, String> requestBody, Principal principal) {
        User user = getCurrentUser(principal);
        String address = requestBody.get("address");
        Order order = orderService.checkout(user, address);
        return ResponseEntity.ok(order);
    }

    // Retrieve order list for active user
    @GetMapping
    public ResponseEntity<List<Order>> getUserOrders(Principal principal) {
        User user = getCurrentUser(principal);
        return ResponseEntity.ok(orderService.getUserOrders(user));
    }

    // Retrieve single order details
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id, Principal principal) {
        User user = getCurrentUser(principal);
        return ResponseEntity.ok(orderService.getOrderById(id, user));
    }

    // Fetch all orders in system (Protected: ADMIN Only)
    @GetMapping("/admin/all")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // Update order status (Protected: ADMIN Only)
    @PutMapping("/admin/status/{id}")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam("status") String status) {
        Order updatedOrder = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(updatedOrder);
    }
}
