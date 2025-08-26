package com.e_commerce.repository.order;

import com.e_commerce.entity.order.CartItems;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemsRepository extends JpaRepository<CartItems, Integer> {
}
