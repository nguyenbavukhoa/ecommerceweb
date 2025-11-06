package com.e_commerce.repository.product;

import com.e_commerce.entity.product.OptionGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OptionsGroupRepository extends JpaRepository<OptionGroup, Integer> {
    @Query("SELECT v FROM OptionGroup v WHERE v.product.id = :id")
    List<OptionGroup> findByProductCategoryId(@Param("id") Integer id);
}
