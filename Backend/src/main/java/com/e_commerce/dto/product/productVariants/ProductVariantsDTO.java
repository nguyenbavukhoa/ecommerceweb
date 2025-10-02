package com.e_commerce.dto.product.productVariants;

import com.e_commerce.dto.product.productDTO.ProductDTO;
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

    private ProductDTO product;

    private BigDecimal price;

    private Integer stock;

    private String sku;

}
