package com.e_commerce.specification;

import com.e_commerce.dto.product.productDTO.ProductFilter;
import com.e_commerce.entity.product.Product;
import com.e_commerce.enums.AvailabilityStatus;
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
                predicates.add(root.get("category").get("id").in(productFilter.getCategoryId()));
            }

            // Filter theo trạng thái status
            if (productFilter.getStatus() != null) {
                try {
                    AvailabilityStatus status = AvailabilityStatus.valueOf(productFilter.getStatus().toUpperCase());
                    predicates.add(criteriaBuilder.equal(root.get("status"), status));
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
