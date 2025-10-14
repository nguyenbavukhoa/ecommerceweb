package com.e_commerce.service.product.impl;

import com.e_commerce.dto.product.optionGroupDTO.OptionsGroupCreateDTO;
import com.e_commerce.dto.product.optionGroupDTO.OptionsGroupDTO;
import com.e_commerce.dto.product.optionGroupDTO.OptionsGroupUpdateDTO;
import com.e_commerce.entity.product.OptionGroup;
import com.e_commerce.exceptions.CustomException;
import com.e_commerce.exceptions.ErrorResponse;
import com.e_commerce.mapper.product.OptionsGroupMapper;
import com.e_commerce.orther.IdGenerator;
import com.e_commerce.repository.product.VariantOptionsRepository;
import com.e_commerce.service.product.VariantOptionsService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class VariantOptionsServiceImpl implements VariantOptionsService {
    private final OptionsGroupMapper optionsGroupMapper;
    private final VariantOptionsRepository variantOptionsRepository;
    @Override
    public OptionGroup getVariantOptionEntityById(Integer id) {
        return variantOptionsRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorResponse.VARIANT_OPTION_NOT_FOUND));
    }

    @Override
    public OptionsGroupDTO createVariantOption(OptionsGroupCreateDTO optionsGroupCreateDTO) {
        OptionGroup optionGroup = optionsGroupMapper.convertCreateDTOToEntity(optionsGroupCreateDTO);
        optionGroup.setId(IdGenerator.getGenerationId());
        return optionsGroupMapper.convertEntityToDTO(variantOptionsRepository.save(optionGroup));
    }

    @Override
    public OptionsGroupDTO updateVariantOption(OptionsGroupUpdateDTO optionsGroupUpdateDTO, Integer id) {
        OptionGroup existingVariantOption = getVariantOptionEntityById(id);
        if(optionsGroupUpdateDTO.getName() != null) {
            existingVariantOption.setName(optionsGroupUpdateDTO.getName());
        }
        return optionsGroupMapper.convertEntityToDTO(variantOptionsRepository.save(existingVariantOption));
    }

    @Override
    public List<OptionsGroupDTO> getVariantOptionByProductCategoryId(Integer id) {
        return optionsGroupMapper.convertPageToListDTO(variantOptionsRepository.findByProductCategoryId(id));
    }
}
