package com.e_commerce.repository.product;

import com.e_commerce.entity.product.ProductCategories;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductCategoryRepository extends JpaRepository<ProductCategories, Integer> {
    List<ProductCategories> findByCategory_Id(Integer categoryId);
}
