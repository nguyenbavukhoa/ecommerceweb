package com.e_commerce.repository.product;

import com.e_commerce.entity.product.OptionValues;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OptionsValuesRepository extends JpaRepository<OptionValues, Integer> {
    @Query("SELECT v FROM OptionValues v WHERE v.optionGroup.id = ?1")
    List<OptionValues> findByVariantOptionId(Integer id);

    @Modifying
    @Query("UPDATE OptionValues o SET o.stockQuantity = o.stockQuantity - :quantity WHERE o.id = :optionValueId AND o.stockQuantity >= :quantity")
    int decreaseStock(@Param("optionValueId") Integer optionValueId, @Param("quantity") int quantity);
}
