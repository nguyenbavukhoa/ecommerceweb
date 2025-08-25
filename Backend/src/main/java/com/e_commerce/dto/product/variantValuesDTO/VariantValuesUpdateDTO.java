package com.e_commerce.dto.product.variantValuesDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VariantValuesUpdateDTO {
    private String value;

    private BigDecimal price;
}
