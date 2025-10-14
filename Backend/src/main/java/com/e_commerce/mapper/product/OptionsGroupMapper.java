package com.e_commerce.mapper.product;

import com.e_commerce.dto.product.optionGroupDTO.OptionsGroupCreateDTO;
import com.e_commerce.dto.product.optionGroupDTO.OptionsGroupDTO;
import com.e_commerce.dto.product.optionGroupDTO.OptionsGroupUpdateDTO;
import com.e_commerce.entity.product.OptionGroup;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class OptionsGroupMapper {
    private final OptionsValuesMapper optionsValuesMapper;
    public OptionsGroupDTO convertEntityToDTO(OptionGroup optionGroup) {
        return OptionsGroupDTO.builder()
                .id(optionGroup.getId())
                .name(optionGroup.getName())
                .values(optionsValuesMapper.convertPageToListDTO(optionGroup.getValues()))
                .build();
    }

    public OptionGroup convertCreateDTOToEntity(OptionsGroupCreateDTO optionsGroupCreateDTO) {
        return OptionGroup.builder()
                .name(optionsGroupCreateDTO.getName())
                .build();
    }

    public OptionGroup convertUpdateDTOToEntity(OptionsGroupUpdateDTO optionsGroupUpdateDTO) {
        return OptionGroup.builder()
                .name(optionsGroupUpdateDTO.getName())
                .build();
    }

    public List<OptionsGroupDTO> convertPageToListDTO(List<OptionGroup> optionGroupList) {
        return optionGroupList.stream()
                .map(this::convertEntityToDTO)
                .toList();
    }
}
