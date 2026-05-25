package com.plants.backend.service;

import com.plants.backend.model.CartItem;
import com.plants.backend.model.Plant;
import com.plants.backend.model.User;
import com.plants.backend.repository.CartRepository;
import com.plants.backend.exception.ResourceNotFoundException;
import com.plants.backend.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private PlantService plantService;

    // Fetch all cart items belonging to the current user
    public List<CartItem> getCartForUser(User user) {
        return cartRepository.findByUserId(user.getId());
    }

    // Add a plant to the user's cart or increment its quantity if it already exists
    @Transactional
    public CartItem addPlantToCart(User user, Long plantId, Integer quantity) {
        Plant plant = plantService.getPlantById(plantId);

        // Enforce inventory checks
        if (plant.getStock() < quantity) {
            throw new BadRequestException("Requested quantity (" + quantity + ") exceeds available stock (" + plant.getStock() + ") for " + plant.getName());
        }

        Optional<CartItem> existingCartItem = cartRepository.findByUserIdAndPlantId(user.getId(), plantId);

        if (existingCartItem.isPresent()) {
            CartItem cartItem = existingCartItem.get();
            int newQuantity = cartItem.getQuantity() + quantity;
            if (plant.getStock() < newQuantity) {
                throw new BadRequestException("Adding " + quantity + " more would exceed stock limit of " + plant.getStock());
            }
            cartItem.setQuantity(newQuantity);
            return cartRepository.save(cartItem);
        } else {
            CartItem cartItem = CartItem.builder()
                    .user(user)
                    .plant(plant)
                    .quantity(quantity)
                    .build();
            return cartRepository.save(cartItem);
        }
    }

    // Adjust a cart item's quantity
    @Transactional
    public CartItem updateCartItemQuantity(User user, Long cartItemId, Integer quantity) {
        CartItem cartItem = cartRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + cartItemId));

        // Security check: ensure user owns the cart item
        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Access denied: You do not own this cart item.");
        }

        // Inventory check
        if (cartItem.getPlant().getStock() < quantity) {
            throw new BadRequestException("Requested quantity (" + quantity + ") exceeds stock (" + cartItem.getPlant().getStock() + ")");
        }

        cartItem.setQuantity(quantity);
        return cartRepository.save(cartItem);
    }

    // Remove an item from the cart
    @Transactional
    public void removeCartItem(User user, Long cartItemId) {
        CartItem cartItem = cartRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + cartItemId));

        // Security check
        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Access denied: You do not own this cart item.");
        }

        cartRepository.delete(cartItem);
    }

    // Wipe out the user's cart (usually triggered on checkout completion)
    @Transactional
    public void clearCart(User user) {
        cartRepository.deleteByUserId(user.getId());
    }
}
