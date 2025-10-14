package com.e_commerce.repository.product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ProductVariantRepository extends JpaRepository<ProductVariants, Integer> {
    @Query("""
        SELECT pv.stockQuantity
        FROM ProductVariants pv
        JOIN pv.product p
        WHERE pv.id = :productVariantId
          AND p.isActive = true
          AND pv.productVariantsStatus = 'ACTIVE'
    """)
    Integer checkProductVariantAvailability(@Param("productVariantId") Integer productVariantId);

    @Transactional
    @Modifying
    @Query("UPDATE ProductVariants pv SET pv.stockQuantity = pv.stockQuantity - :quantity " +
            "WHERE pv.id = :productVariantId AND pv.stockQuantity >= :quantity")
    int decreaseStock(@Param("productVariantId") Integer productVariantId,
                      @Param("quantity") Integer quantity);

    List<ProductVariants> findByProductId(Integer productId);
}
