package com.e_commerce.dto.product.variantOptionsDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VariantOptionsCreateDTO {
    private String name;
    private Integer productCategoriesId;
}
