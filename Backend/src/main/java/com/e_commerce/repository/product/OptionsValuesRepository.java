package com.e_commerce.repository.product;

import com.e_commerce.entity.product.OptionValues;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OptionsValuesRepository extends JpaRepository<OptionValues, Integer> {
    @Query("SELECT v FROM OptionValues v WHERE v.optionGroup.id = ?1")
    List<OptionValues> findByVariantOptionId(Integer id);
}
