package com.e_commerce.repository.order;

import com.e_commerce.entity.order.CartItems;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CartItemsRepository extends JpaRepository<CartItems, Integer> {
    Optional<CartItems> findByCartIdAndProductVariantId(Integer cartId, Integer productVariantId);


    @Query("""
    SELECT ci
    FROM CartItems ci
    WHERE ci.cart.id = :cartId
      AND ci.productVariant.id = :productVariantId
      AND (
            (:variantValueId IS NULL AND ci.variantValue IS NULL)
         OR (ci.variantValue.id = :variantValueId)
      )
""")
    Optional<CartItems> findByCartIdAndProductVariantIdAndVariantValueId(
            @Param("cartId") Integer cartId,
            @Param("productVariantId") Integer productVariantId,
            @Param("variantValueId") Integer variantValueId
    );

    List<CartItems> findByCart_Account_Id(Integer id);

    void deleteAllByCart_Account_Id(Integer accountId);

}
