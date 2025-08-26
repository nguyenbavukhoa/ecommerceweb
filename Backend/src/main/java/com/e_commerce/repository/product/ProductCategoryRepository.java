package com.e_commerce.repository.product;

import com.e_commerce.entity.product.ProductCategories;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductCategoryRepository extends JpaRepository<ProductCategories, Integer> {
}
