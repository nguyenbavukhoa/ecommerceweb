package com.e_commerce.dto.product.variantOptionsDTO;

import com.e_commerce.entity.product.ProductCategories;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VariantOptionsDTO {
    private Integer id;
    private String name;
    private ProductCategories productCategories;
}
