package com.e_commerce.dto.product.productVariants;

import com.e_commerce.dto.product.productDTO.ProductDTO;
import com.e_commerce.dto.product.variantValuesDTO.VariantValuesDTO;
import com.e_commerce.enums.ProductVariantsStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductVariantsDTO {
    private Integer id;

    private BigDecimal price;

    private Integer stock;

    private String sku;

    private Integer stockQuantity;

    private String imgUrl;

    private ProductVariantsStatus status;

    private List<VariantValuesDTO> variantValues;
}
