package com.e_commerce.dto.product.variantValuesDTO;

import com.e_commerce.entity.product.VariantOptions;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class variantValuesDTO {
    private Integer id;

    private String value;

    private BigDecimal price;

    private VariantOptions variantOptions;
}
