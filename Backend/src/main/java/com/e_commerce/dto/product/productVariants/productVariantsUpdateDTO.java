package com.e_commerce.dto.product.productVariants;

import com.e_commerce.enums.ProductVariantsStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class productVariantsUpdateDTO {
    private BigDecimal price;

    private Integer stockQuantity;

    private String sku;

    private String imgUrl;

    private ProductVariantsStatus productVariantsStatus;
}
