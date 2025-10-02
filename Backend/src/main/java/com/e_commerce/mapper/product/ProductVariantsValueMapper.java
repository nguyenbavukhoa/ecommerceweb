package com.e_commerce.mapper.product;

import com.e_commerce.dto.product.productVariantValueDTO.ProductVariantValueCreateDTO;
import com.e_commerce.dto.product.productVariantValueDTO.ProductVariantValueDTO;
import com.e_commerce.dto.product.variantOptionsDTO.VariantOptionsDTO;
import com.e_commerce.dto.product.variantValuesDTO.VariantValuesDTO;
import com.e_commerce.entity.product.ProductVariantValues;
import com.e_commerce.entity.product.VariantValues;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ProductVariantsValueMapper {
    private final VariantOptionsMapper variantOptionsMapper;

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
                .collect(Collectors.toList());
    }

    public VariantValuesDTO convertEntityToVariantValueDTO(ProductVariantValues productVariantValues) {
        return VariantValuesDTO.builder()
                .id(productVariantValues.getVariantValues().getId())
                .value(productVariantValues.getVariantValues().getValue())
                .price(productVariantValues.getVariantValues().getPrice())
                .stockQuantity(productVariantValues.getQuantity())
                .variantOptions(variantOptionsMapper.convertEntityToDTO(productVariantValues.getVariantValues().getVariantOptions()))
                .build();
    }

    public List<VariantValuesDTO> convertListEntityToListVariantValueDTO(List<ProductVariantValues> productVariantValuesList) {
        return productVariantValuesList.stream()
                .map(this::convertEntityToVariantValueDTO)
                .collect(Collectors.toList());
    }
}
