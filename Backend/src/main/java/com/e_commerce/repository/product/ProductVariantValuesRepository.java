package com.e_commerce.repository.product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ProductVariantValuesRepository extends JpaRepository<ProductVariantValues, Integer> {
    @Query("""
        SELECT pvv.quantity
        FROM ProductVariantValues pvv
        JOIN pvv.productVariants pv
        JOIN pv.product p
        WHERE pv.id = :variantId
          AND pvv.variantValues.id = :valueId
          AND pv.productVariantsStatus = 'ACTIVE'
          AND p.isActive = true
    """)
    Integer isVariantValueAvailable(@Param("variantId") Integer variantId,
                                    @Param("valueId") Integer valueId);

    @Transactional
    @Modifying
    @Query("UPDATE ProductVariantValues pvv SET pvv.quantity = pvv.quantity - :quantity " +
            "WHERE pvv.productVariants.id = :productVariantId " +
            "AND pvv.variantValues.id = :variantValueId " +
            "AND pvv.quantity >= :quantity")
    int decreaseStock(@Param("productVariantId") Integer productVariantId,
                      @Param("variantValueId") Integer variantValueId,
    @Param("quantity") Integer quantity);

    List<ProductVariantValues> findByProductVariants_Id(Integer variantId);
}
