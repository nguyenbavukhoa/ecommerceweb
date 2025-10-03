package com.e_commerce.dto.product.variantValuesDTO;

import com.e_commerce.dto.product.variantOptionsDTO.VariantOptionsDTO;
import com.e_commerce.entity.product.VariantOptions;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VariantValuesDTO {
    private Integer id;

    private String value;

    private BigDecimal price;

    private Integer stockQuantity;
}
