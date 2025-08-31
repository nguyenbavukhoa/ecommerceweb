package com.e_commerce.mapper.product;

import com.e_commerce.dto.product.productVariantValueDTO.ProductVariantValueCreateDTO;
import com.e_commerce.dto.product.productVariantValueDTO.ProductVariantValueDTO;
import com.e_commerce.entity.product.ProductVariantValues;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ProductVariantsValueMapper {
    public ProductVariantValueDTO convertEntityToDTO(ProductVariantValues productVariantsValue) {
        return ProductVariantValueDTO.builder()
                .id(productVariantsValue.getId())
                .variantId(productVariantsValue.getProductVariants())
                .valueId(productVariantsValue.getVariantValues())
                .quantity(productVariantsValue.getQuantity())
                .build();
    }

    public ProductVariantValues convertCreateDTOToEntity(ProductVariantValueCreateDTO productVariantValueCreateDTO) {
        return ProductVariantValues.builder()
                .quantity(productVariantValueCreateDTO.getQuantity())
                .build();
    }

    public ProductVariantValues convertUpdateDTOToEntity(ProductVariantValueCreateDTO productVariantValueCreateDTO) {
        return ProductVariantValues.builder()
                .quantity(productVariantValueCreateDTO.getQuantity())
                .build();
    }

    public List<ProductVariantValueDTO> convertPageToListDTO(List<ProductVariantValues> productVariantValuesList) {
        return productVariantValuesList.stream()
                .map(this::convertEntityToDTO)
                .toList();
    }
}
