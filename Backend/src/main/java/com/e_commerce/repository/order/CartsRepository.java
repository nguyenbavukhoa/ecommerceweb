package com.e_commerce.repository.order;

import com.e_commerce.entity.order.Carts;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartsRepository extends JpaRepository<Carts, Integer> {
    Optional<Carts> findByAccountId(Integer accountId);
}
