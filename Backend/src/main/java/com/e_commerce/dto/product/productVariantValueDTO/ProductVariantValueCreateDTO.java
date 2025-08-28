package com.e_commerce.dto.product.productVariantValueDTO;

import com.e_commerce.entity.product.ProductVariants;
import com.e_commerce.entity.product.VariantValues;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductVariantValueCreateDTO {
    private Integer valueId;

    private Integer variantId;

    private Integer quantity;
}
