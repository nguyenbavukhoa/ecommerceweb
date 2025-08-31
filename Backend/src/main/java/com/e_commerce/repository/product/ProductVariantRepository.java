package com.e_commerce.repository.product;

import com.e_commerce.entity.product.ProductVariants;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductVariantRepository extends JpaRepository<ProductVariants, Integer> {
    @Query("""
        SELECT pv.stockQuantity
        FROM ProductVariants pv
        JOIN pv.productId p
        WHERE pv.id = :productVariantId
          AND p.isActive = true
          AND pv.productVariantsStatus = 'ACTIVE'
    """)
    Integer checkProductVariantAvailability(@Param("productVariantId") Integer productVariantId);
}
