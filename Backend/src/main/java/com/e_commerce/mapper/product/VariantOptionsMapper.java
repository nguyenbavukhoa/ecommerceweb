package com.e_commerce.mapper.product;

import com.e_commerce.dto.product.variantOptionsDTO.VariantOptionsCreateDTO;
import com.e_commerce.dto.product.variantOptionsDTO.VariantOptionsDTO;
import com.e_commerce.dto.product.variantOptionsDTO.VariantOptionsUpdateDTO;
import com.e_commerce.entity.product.VariantOptions;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class VariantOptionsMapper {
    public VariantOptionsDTO convertEntityToDTO(VariantOptions variantOptions) {
        return VariantOptionsDTO.builder()
                .name(variantOptions.getName())
                .build();
    }

    public VariantOptions convertCreateDTOToEntity(VariantOptionsCreateDTO variantOptionsCreateDTO) {
        return VariantOptions.builder()
                .name(variantOptionsCreateDTO.getName())
                .build();
    }

    public VariantOptions convertUpdateDTOToEntity(VariantOptionsUpdateDTO variantOptionsUpdateDTO) {
        return VariantOptions.builder()
                .name(variantOptionsUpdateDTO.getName())
                .build();
    }

    public List<VariantOptionsDTO> convertPageToListDTO(List<VariantOptions> variantOptionsList) {
        return variantOptionsList.stream()
                .map(this::convertEntityToDTO)
                .toList();
    }
}
