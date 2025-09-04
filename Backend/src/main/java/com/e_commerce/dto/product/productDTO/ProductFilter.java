package com.e_commerce.dto.product.productDTO;

import lombok.Data;

@Data
public class ProductFilter {
    private Integer categoryId;

    private Integer productCategoriesId;

    private Boolean isActive;

    private String name;

    private Integer minPrice;

    private Integer maxPrice;
}
