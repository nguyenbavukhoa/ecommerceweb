package com.e_commerce.dto.product.productCategoryDTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class productCategoryCreateDTO {
    @NotBlank(message = "Product name is required")
    @Size(max = 1000, message = "Product name cannot exceed 1000 characters")
    private String name;

    @NotBlank(message = "CategoryId is required")
    private Integer categoryId;
}
