package com.e_commerce.repository.product;

import com.e_commerce.entity.product.VariantValues;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface VariantValuesRepository extends JpaRepository<VariantValues, Integer> {
    @Query("SELECT v FROM VariantValues v WHERE v.variantOptions.id = ?1")
    List<VariantValues> findByVariantOptionId(Integer id);
}
