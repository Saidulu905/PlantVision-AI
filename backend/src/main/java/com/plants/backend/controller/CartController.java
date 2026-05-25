package com.plants.backend.controller;

import com.plants.backend.dto.CartRequest;
import com.plants.backend.model.CartItem;
import com.plants.backend.model.User;
import com.plants.backend.service.CartService;
import com.plants.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private UserService userService;

    // Helper method to resolve current User context from request Principal
    private User getCurrentUser(Principal principal) {
        return userService.getUserByEmail(principal.getName());
    }

    // View shopping cart contents
    @GetMapping
    public ResponseEntity<List<CartItem>> getCart(Principal principal) {
        User user = getCurrentUser(principal);
        return ResponseEntity.ok(cartService.getCartForUser(user));
    }

    // Add a plant to the shopping cart
    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@Valid @RequestBody CartRequest cartRequest, Principal principal) {
        User user = getCurrentUser(principal);
        CartItem cartItem = cartService.addPlantToCart(user, cartRequest.getPlantId(), cartRequest.getQuantity());
        return ResponseEntity.ok(cartItem);
    }

    // Adjust a cart item's quantity
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateCartItemQuantity(
            @PathVariable Long id,
            @RequestParam("quantity") Integer quantity,
            Principal principal) {
        User user = getCurrentUser(principal);
        CartItem updatedItem = cartService.updateCartItemQuantity(user, id, quantity);
        return ResponseEntity.ok(updatedItem);
    }

    // Remove a single item from the cart
    @DeleteMapping("/remove/{id}")
    public ResponseEntity<?> removeCartItem(@PathVariable Long id, Principal principal) {
        User user = getCurrentUser(principal);
        cartService.removeCartItem(user, id);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Item successfully removed from cart.");
        
        return ResponseEntity.ok(response);
    }

    // Wipe out the shopping cart
    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(Principal principal) {
        User user = getCurrentUser(principal);
        cartService.clearCart(user);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Cart successfully cleared.");

        return ResponseEntity.ok(response);
    }
}
