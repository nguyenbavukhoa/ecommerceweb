package com.e_commerce.service.retaurant.impl;

import com.e_commerce.entity.Restaurant;
import com.e_commerce.entity.order.Orders;
import com.e_commerce.enums.OrderStatus;
import com.e_commerce.repository.RestaurantRepository;
import com.e_commerce.repository.order.OrdersRepository;
import com.e_commerce.service.retaurant.RestaurantService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class RestaurantServiceImpl implements RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final OrdersRepository ordersRepository;

    private static final List<OrderStatus> ACTIVE_ORDER_STATUSES = List.of(
            OrderStatus.PLACED,
            OrderStatus.CONFIRMED,
            OrderStatus.IN_PROGRESS
    );


    @Override
    public Restaurant create(Restaurant restaurant) {
        if (restaurantRepository.existsByName(restaurant.getName())) {
            throw new RuntimeException("Restaurant with name " + restaurant.getName() + " already exists");
        }
        if (restaurantRepository.existsByCode(restaurant.getCode())) {
            throw new RuntimeException("Restaurant with code " + restaurant.getCode() + " already exists");
        }
        return restaurantRepository.save(restaurant);
    }

    @Override
    public List<Restaurant> getAll() {
        return restaurantRepository.findAll();
    }

    @Override
    public Restaurant getById(Integer id) {
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant with id " + id + " not found"));
    }

    @Override
    public void delete(Integer id) {
        Restaurant restaurant = getById(id);
        if (ordersRepository.existsByRestaurantIdAndOrderStatusIn(id, ACTIVE_ORDER_STATUSES)) {
            throw new RuntimeException("Cannot delete restaurant with active orders");
        }
        restaurant.setActive(false);
        restaurantRepository.save(restaurant);
    }

    @Override
    public List<Orders> getOrders(Integer restaurantId) {
        return ordersRepository.findByRestaurantId(restaurantId);
    }
}
