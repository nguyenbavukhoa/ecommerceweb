package com.e_commerce.specification;

import com.e_commerce.dto.product.productDTO.ProductFilter;
import com.e_commerce.entity.product.Product;
import com.e_commerce.exceptions.CustomException;
import com.e_commerce.exceptions.ErrorResponse;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class ProductSpecification {
    public static Specification<Product> filterProduct(ProductFilter productFilter) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Filter theo categoryId
            if (productFilter.getCategoryId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("category").get("id"), productFilter.getCategoryId()));
            }

            // Filter theo trạng thái isActive
            if (productFilter.getIsActive() != null) {
                try {
                    predicates.add(criteriaBuilder.equal(root.get("isActive"), productFilter.getIsActive()));
                } catch (IllegalArgumentException ex) {
                    throw new CustomException(ErrorResponse.PRODUCT_STATUS_INVALID);
                }
            }

            // Filter theo tên sản phẩm (LIKE)
            if (productFilter.getName() != null && !productFilter.getName().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("name")),
                        "%" + productFilter.getName().toLowerCase() + "%"
                ));
            }

            // Filter theo giá min/max
            if (productFilter.getMinPrice() != null && productFilter.getMaxPrice() != null) {
                predicates.add(criteriaBuilder.between(root.get("priceBase"),
                        productFilter.getMinPrice(), productFilter.getMaxPrice()));
            } else if (productFilter.getMinPrice() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("priceBase"), productFilter.getMinPrice()));
            } else if (productFilter.getMaxPrice() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("priceBase"), productFilter.getMaxPrice()));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));

        };

    }

}
