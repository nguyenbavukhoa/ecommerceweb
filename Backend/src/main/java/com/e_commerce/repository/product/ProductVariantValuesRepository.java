package com.e_commerce.repository.product;

import com.e_commerce.entity.product.ProductVariantValues;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductVariantValuesRepository extends JpaRepository<ProductVariantValues, Integer> {
    @Query("""
        SELECT pvv.quantity
        FROM ProductVariantValues pvv
        JOIN pvv.productVariants pv
        JOIN pv.productId p
        WHERE pv.id = :variantId
          AND pvv.variantValues.id = :valueId
          AND pv.productVariantsStatus = 'ACTIVE'
          AND p.isActive = true
    """)
    Integer isVariantValueAvailable(@Param("variantId") Integer variantId,
                                    @Param("valueId") Integer valueId);

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
