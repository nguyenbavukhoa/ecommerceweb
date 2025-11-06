package com.e_commerce.dto.product.productDTO;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductFilter {
    private List<Integer> categoryId;

    private Integer productId;

    private String status;

    private String name;

    private BigDecimal minPrice;

    private BigDecimal maxPrice;

    private String sortBy;
    private String sortOrder;
}
