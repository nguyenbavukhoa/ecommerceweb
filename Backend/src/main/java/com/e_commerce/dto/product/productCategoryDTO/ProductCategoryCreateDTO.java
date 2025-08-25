package com.e_commerce.dto.product.productCategoryDTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductCategoryCreateDTO {
    @NotBlank(message = "Product name is required")
    @Size(max = 1000, message = "Product name cannot exceed 1000 characters")
    private String name;

    @NotBlank(message = "CategoryId is required")
    private Integer categoryId;
}
