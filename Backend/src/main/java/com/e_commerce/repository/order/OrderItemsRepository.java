package com.e_commerce.repository.order;

import com.e_commerce.entity.order.OrderItems;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemsRepository extends JpaRepository<OrderItems, Integer> {
}
