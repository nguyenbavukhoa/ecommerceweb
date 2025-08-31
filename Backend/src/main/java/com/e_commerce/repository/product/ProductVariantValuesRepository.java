package com.e_commerce.repository.product;

import com.e_commerce.entity.product.ProductVariantValues;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductVariantValuesRepository extends JpaRepository<ProductVariantValues, Integer> {
    @Query("""
        SELECT CASE WHEN COUNT(pvv) > 0 THEN true ELSE false END
        FROM ProductVariantValues pvv
        JOIN pvv.productVariants pv
        JOIN pv.productId p
        WHERE pv.id = :variantId
          AND pvv.variantValues.id = :valueId
          AND pv.stockQuantity >= :requiredQuantity
          AND pvv.quantity >= :requiredQuantity
          AND pv.productVariantsStatus = 'ACTIVE'
          AND p.isActive = true
    """)
    boolean isVariantValueAvailable(@Param("variantId") Integer variantId,
                                    @Param("valueId") Integer valueId,
                                    @Param("requiredQuantity") Integer requiredQuantity);


    @Query("""
        SELECT CASE WHEN COUNT(pv) > 0 THEN true ELSE false END
        FROM ProductVariants pv
        JOIN pv.productId p
        WHERE pv.id = :productVariantId
          AND pv.stockQuantity >= :requiredQuantity
          AND p.isActive = true
          AND pv.productVariantsStatus = 'ACTIVE'
    """)
    boolean checkProductVariantAvailability(@Param("productVariantId") Integer productVariantId,
                                            @Param("requiredQuantity") Integer requiredQuantity);
}
