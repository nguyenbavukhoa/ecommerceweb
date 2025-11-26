package com.e_commerce.controller.retaurant;

import com.e_commerce.dto.ApiResponse;
import com.e_commerce.entity.Restaurant;
import com.e_commerce.service.retaurant.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/restaurants")
@RequiredArgsConstructor
public class RestaurantController {
    private final RestaurantService restaurantService;

    @PostMapping
    public ResponseEntity<ApiResponse<?>> createRestaurant(@RequestBody Restaurant restaurant) {
        Restaurant createdRestaurant = restaurantService.create(restaurant);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Restaurant created successfully", createdRestaurant, null, "/restaurants")
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<?>> getAllRestaurants() {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Get all restaurants successfully", restaurantService.getAll(), null, "/restaurants")
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> getRestaurantById(@PathVariable Integer id) {
        Restaurant restaurant = restaurantService.getById(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Get restaurant successfully", restaurant, null, "/restaurants/" + id)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> deleteRestaurant(@PathVariable Integer id) {
        restaurantService.delete(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Restaurant deleted successfully", null, null, "/restaurants/" + id)
        );
    }

    @GetMapping("/{id}/orders")
    public ResponseEntity<?> getOrders(@PathVariable Integer id) {
        return ResponseEntity.ok(restaurantService.getOrders(id));
    }


}
