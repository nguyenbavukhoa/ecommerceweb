package com.e_commerce.dto.product.variantOptionsDTO;

import com.e_commerce.entity.product.ProductCategories;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class variantOptionsDTO {
    private Integer id;
    private String name;
    private ProductCategories productCategories;
}
