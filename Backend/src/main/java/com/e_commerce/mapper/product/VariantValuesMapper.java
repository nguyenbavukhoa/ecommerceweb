package com.e_commerce.mapper.product;

import com.e_commerce.dto.product.optionValuesDTO.OptionValuesCreateDTO;
import com.e_commerce.dto.product.optionValuesDTO.OptionValuesDTO;
import com.e_commerce.dto.product.optionValuesDTO.OptionValuesUpdateDTO;
import com.e_commerce.entity.product.VariantValues;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class VariantValuesMapper {

    public OptionValuesDTO convertEntityToDTO(VariantValues variantValues) {
        return OptionValuesDTO.builder()
                .id(variantValues.getId())
                .value(variantValues.getValue())
                .price(variantValues.getPrice())
                .stockQuantity(variantValues.getStockQuantity())
                .build();
    }

    public VariantValues convertCreateDTOToEntity(OptionValuesCreateDTO optionValuesCreateDTO) {
        return VariantValues.builder()
                .value(optionValuesCreateDTO.getValue())
                .price(optionValuesCreateDTO.getPrice())
                .stockQuantity(optionValuesCreateDTO.getStockQuantity())
                .build();
    }

    public VariantValues convertUpdateDTOToEntity(OptionValuesUpdateDTO optionValuesUpdateDTO) {
        return VariantValues.builder()
                .value(optionValuesUpdateDTO.getValue())
                .price(optionValuesUpdateDTO.getPrice())
                .stockQuantity(optionValuesUpdateDTO.getStockQuantity())
                .build();
    }

    public List<OptionValuesDTO> convertPageToListDTO(List<VariantValues> variantValuesList) {
        return variantValuesList.stream()
                .map(this::convertEntityToDTO)
                .toList();
    }
}
