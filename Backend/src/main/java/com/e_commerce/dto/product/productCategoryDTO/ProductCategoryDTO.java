package com.e_commerce.dto.product.productCategoryDTO;

import com.e_commerce.entity.product.Category;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductCategoryDTO {
    private Integer id;

    private String name;
}
