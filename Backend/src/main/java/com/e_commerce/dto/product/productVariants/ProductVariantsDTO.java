package com.e_commerce.dto.product.productVariants;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductVariantsDTO {
    private Integer id;

    private Integer productId;

    private BigDecimal price;

    private Integer stock;
}
