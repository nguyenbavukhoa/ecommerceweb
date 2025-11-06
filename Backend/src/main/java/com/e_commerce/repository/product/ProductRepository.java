package com.e_commerce.repository.product;

import com.e_commerce.entity.product.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface ProductRepository extends JpaRepository<Product, Integer>, JpaSpecificationExecutor<Product> {
    @Modifying
    @Query("UPDATE Product p SET p.quantity = p.quantity - :quantity WHERE p.id = :productId AND p.quantity >= :quantity")
    int decreaseStock(@Param("productId") Integer productId,
                      @Param("quantity") int quantity);
}
