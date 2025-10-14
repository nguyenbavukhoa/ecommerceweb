package com.e_commerce.dto.product.optionValuesDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OptionValuesDTO {
    private Integer id;

    private String value;

    private BigDecimal price;

    private Integer stockQuantity;
}
