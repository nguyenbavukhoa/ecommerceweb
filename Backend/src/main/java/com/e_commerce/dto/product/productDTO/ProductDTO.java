package com.e_commerce.dto.product.productDTO;

import com.e_commerce.dto.product.productCategoryDTO.ProductCategoryDTO;
import com.e_commerce.entity.product.ProductCategories;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO {
    private Integer id;

    private String name;

    private boolean isActive;

    private BigDecimal priceBase;

    private ProductCategoryDTO productCategoryDTO;

    private String description;

    private String imgMain;
}
