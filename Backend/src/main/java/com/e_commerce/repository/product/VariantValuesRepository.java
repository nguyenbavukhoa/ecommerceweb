package com.e_commerce.repository.product;

import com.e_commerce.entity.product.VariantValues;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VariantValuesRepository extends JpaRepository<VariantValues, Integer> {
}
