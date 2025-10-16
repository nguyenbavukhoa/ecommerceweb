package com.e_commerce.service.product.impl;

import com.e_commerce.dto.product.optionGroupDTO.OptionsGroupCreateDTO;
import com.e_commerce.dto.product.optionGroupDTO.OptionsGroupDTO;
import com.e_commerce.dto.product.optionGroupDTO.OptionsGroupUpdateDTO;
import com.e_commerce.entity.product.OptionGroup;
import com.e_commerce.exceptions.CustomException;
import com.e_commerce.exceptions.ErrorResponse;
import com.e_commerce.mapper.product.OptionsGroupMapper;
import com.e_commerce.orther.IdGenerator;
import com.e_commerce.repository.product.OptionsGroupRepository;
import com.e_commerce.service.product.OptionsGroupService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class OptionsGroupServiceImpl implements OptionsGroupService {
    private final OptionsGroupMapper optionsGroupMapper;
    private final OptionsGroupRepository optionsGroupRepository;
    @Override
    public OptionGroup getVariantOptionEntityById(Integer id) {
        return optionsGroupRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorResponse.OPTIONS_GROUP_NOT_FOUND));
    }

    @Override
    public OptionsGroupDTO createVariantOption(OptionsGroupCreateDTO optionsGroupCreateDTO) {
        OptionGroup optionGroup = optionsGroupMapper.convertCreateDTOToEntity(optionsGroupCreateDTO);
        optionGroup.setId(IdGenerator.getGenerationId());
        return optionsGroupMapper.convertEntityToDTO(optionsGroupRepository.save(optionGroup));
    }

    @Override
    public OptionsGroupDTO updateVariantOption(OptionsGroupUpdateDTO optionsGroupUpdateDTO, Integer id) {
        OptionGroup existingVariantOption = getVariantOptionEntityById(id);
        if(optionsGroupUpdateDTO.getName() != null) {
            existingVariantOption.setName(optionsGroupUpdateDTO.getName());
        }
        return optionsGroupMapper.convertEntityToDTO(optionsGroupRepository.save(existingVariantOption));
    }

    @Override
    public List<OptionsGroupDTO> getOptionGroupsByProductId(Integer id) {
        return optionsGroupMapper.convertPageToListDTO(optionsGroupRepository.findByProductCategoryId(id));
    }
}
