package com.e_commerce.repository.order;

import com.e_commerce.entity.order.CartItems;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemsRepository extends JpaRepository<CartItems, Integer> {
    Optional<CartItems> findByCartIdAndProductVariantId(Integer cartId, Integer productVariantId);

    List<CartItems> findByAccountId(Integer id);

    void deleteAllByAccountId(Integer accountId);
}
