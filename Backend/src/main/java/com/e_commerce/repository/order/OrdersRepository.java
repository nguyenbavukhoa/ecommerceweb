package com.e_commerce.repository.order;

import com.e_commerce.entity.order.Orders;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrdersRepository extends JpaRepository<Orders, Integer> {
    Optional<Orders> findTopByAccount_IdOrderByOrderTimeDesc(Integer accountId);

}
