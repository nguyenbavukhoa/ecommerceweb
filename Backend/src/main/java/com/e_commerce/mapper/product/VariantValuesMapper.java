package com.e_commerce.mapper.product;

import com.e_commerce.dto.product.variantValuesDTO.VariantValuesCreateDTO;
import com.e_commerce.dto.product.variantValuesDTO.VariantValuesDTO;
import com.e_commerce.dto.product.variantValuesDTO.VariantValuesUpdateDTO;
import com.e_commerce.entity.product.VariantValues;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class VariantValuesMapper {
    public VariantValuesDTO convertEntityToDTO(VariantValues variantValues) {
        return VariantValuesDTO.builder()
                .value(variantValues.getValue())
                .price(variantValues.getPrice())
                .variantOptions(variantValues.getVariantOptions())
                .stockQuantity(variantValues.getStockQuantity())
                .build();
    }

    public VariantValues convertCreateDTOToEntity(VariantValuesCreateDTO variantValuesCreateDTO) {
        return VariantValues.builder()
                .value(variantValuesCreateDTO.getValue())
                .price(variantValuesCreateDTO.getPrice())
                .stockQuantity(variantValuesCreateDTO.getStockQuantity())
                .build();
    }

    public VariantValues convertUpdateDTOToEntity(VariantValuesUpdateDTO variantValuesUpdateDTO) {
        return VariantValues.builder()
                .value(variantValuesUpdateDTO.getValue())
                .price(variantValuesUpdateDTO.getPrice())
                .stockQuantity(variantValuesUpdateDTO.getStockQuantity())
                .build();
    }

    public List<VariantValuesDTO> convertPageToListDTO(List<VariantValues> variantValuesList) {
        return variantValuesList.stream()
                .map(this::convertEntityToDTO)
                .toList();
    }
}
