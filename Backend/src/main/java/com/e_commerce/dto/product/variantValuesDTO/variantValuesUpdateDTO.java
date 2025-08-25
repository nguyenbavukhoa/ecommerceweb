package com.e_commerce.dto.product.variantValuesDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class variantValuesUpdateDTO {
    private String value;

    private String price;
}
