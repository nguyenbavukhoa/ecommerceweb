package com.e_commerce.repository.order;

import com.e_commerce.entity.order.Carts;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartsRepository extends JpaRepository<Carts, Integer> {
}
