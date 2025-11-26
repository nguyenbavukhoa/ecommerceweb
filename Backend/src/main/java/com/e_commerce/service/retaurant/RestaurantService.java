package com.e_commerce.service.retaurant;

import com.e_commerce.entity.Restaurant;
import com.e_commerce.entity.order.Orders;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface RestaurantService {
    Restaurant create(Restaurant restaurant);

    List<Restaurant> getAll();

    Restaurant getById(Integer id);

    void delete(Integer id);

    List<Orders> getOrders(Integer restaurantId);
}
