package com.e_commerce.dto.product.productVariantValueDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class productVariantValueCreateDTO {
    private Integer quantity;
}
