package com.e_commerce.repository.product;

import com.e_commerce.entity.product.ProductVariants;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductVariantRepository extends JpaRepository<ProductVariants, Integer> {
}
