package com.e_commerce.repository;

import com.e_commerce.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RestaurantRepository extends JpaRepository<Restaurant, Integer> {
    boolean existsByName(String name);
    boolean existsByCode(String code);

}

