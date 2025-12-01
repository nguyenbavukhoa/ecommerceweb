package com.e_commerce.repository.order;

import com.e_commerce.entity.order.Orders;
import com.e_commerce.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface OrdersRepository extends JpaRepository<Orders, Integer>, JpaSpecificationExecutor<Orders> {
    Optional<Orders> findTopByAccount_IdOrderByOrderTimeDesc(Integer accountId);

    List<Orders> findByRestaurantId(Integer restaurantId);

    boolean existsByRestaurantIdAndOrderStatusIn(Integer restaurantId, List<OrderStatus> statuses);

    Page<Orders> findByRestaurantId(Integer restaurantId, Pageable pageable);

}
