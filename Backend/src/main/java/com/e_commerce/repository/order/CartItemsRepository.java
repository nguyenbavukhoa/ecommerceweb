package com.e_commerce.repository.order;

import com.e_commerce.entity.order.CartItems;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemsRepository extends JpaRepository<CartItems, Integer> {
    Optional<CartItems> findByCartIdAndProductVariantId(Integer cartId, Integer productVariantId);

    Optional<CartItems> findByCartIdAndProductVariantIdAndVariantValueId(Integer cartId, Integer productVariantId, Integer variantValueId);

    List<CartItems> findByCart_Account_Id(Integer id);

    void deleteAllByCart_Account_Id(Integer accountId);

}
