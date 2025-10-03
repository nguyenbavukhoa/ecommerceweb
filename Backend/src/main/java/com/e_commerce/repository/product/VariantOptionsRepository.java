package com.e_commerce.repository.product;

import com.e_commerce.entity.product.VariantOptions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface VariantOptionsRepository extends JpaRepository<VariantOptions, Integer> {
    @Query("SELECT v FROM VariantOptions v WHERE v.productCategories.id = :id")
    List<VariantOptions> findByProductCategoryId(@Param("id") Integer id);
}
