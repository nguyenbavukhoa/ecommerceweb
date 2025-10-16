package com.e_commerce.mapper.product;

import com.e_commerce.dto.product.optionValuesDTO.OptionValuesCreateDTO;
import com.e_commerce.dto.product.optionValuesDTO.OptionValuesDTO;
import com.e_commerce.dto.product.optionValuesDTO.OptionValuesUpdateDTO;
import com.e_commerce.entity.product.OptionValues;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class OptionsValuesMapper {
    public OptionValuesDTO convertEntityToDTO(OptionValues optionValues) {
        return OptionValuesDTO.builder()
                .id(optionValues.getId())
                .value(optionValues.getName())
                .price(optionValues.getAdditionalPrice())
                .stockQuantity(optionValues.getStockQuantity())
                .build();
    }

    public OptionValues convertCreateDTOToEntity(OptionValuesCreateDTO optionValuesCreateDTO) {
        return OptionValues.builder()
                .name(optionValuesCreateDTO.getName())
                .additionalPrice(optionValuesCreateDTO.getPrice())
                .stockQuantity(optionValuesCreateDTO.getStockQuantity())
                .build();
    }

    public OptionValues convertUpdateDTOToEntity(OptionValuesUpdateDTO optionValuesUpdateDTO) {
        return OptionValues.builder()
                .name(optionValuesUpdateDTO.getValue())
                .additionalPrice(optionValuesUpdateDTO.getPrice())
                .stockQuantity(optionValuesUpdateDTO.getStockQuantity())
                .build();
    }

    public List<OptionValuesDTO> convertPageToListDTO(List<OptionValues> variantValuesList) {
        return variantValuesList.stream()
                .map(this::convertEntityToDTO)
                .toList();
    }
}
