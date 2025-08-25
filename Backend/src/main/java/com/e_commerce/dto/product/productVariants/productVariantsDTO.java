package com.e_commerce.dto.product.productVariants;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class productVariantsDTO {
    private Integer id;

    private Integer productId;

    private String variantName;

    private String variantValue;

    private Double price;

    private Integer stock;
}
