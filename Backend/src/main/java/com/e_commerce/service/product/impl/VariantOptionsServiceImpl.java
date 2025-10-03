package com.e_commerce.service.product.impl;

import com.e_commerce.dto.product.variantOptionsDTO.VariantOptionsCreateDTO;
import com.e_commerce.dto.product.variantOptionsDTO.VariantOptionsDTO;
import com.e_commerce.dto.product.variantOptionsDTO.VariantOptionsUpdateDTO;
import com.e_commerce.entity.product.VariantOptions;
import com.e_commerce.exceptions.CustomException;
import com.e_commerce.exceptions.ErrorResponse;
import com.e_commerce.mapper.product.VariantOptionsMapper;
import com.e_commerce.orther.IdGenerator;
import com.e_commerce.repository.product.VariantOptionsRepository;
import com.e_commerce.service.product.VariantOptionsService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class VariantOptionsServiceImpl implements VariantOptionsService {
    private final VariantOptionsMapper variantOptionsMapper;
    private final VariantOptionsRepository variantOptionsRepository;
    @Override
    public VariantOptions getVariantOptionEntityById(Integer id) {
        return variantOptionsRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorResponse.VARIANT_OPTION_NOT_FOUND));
    }

    @Override
    public VariantOptionsDTO createVariantOption(VariantOptionsCreateDTO variantOptionsCreateDTO) {
        VariantOptions variantOptions = variantOptionsMapper.convertCreateDTOToEntity(variantOptionsCreateDTO);
        variantOptions.setId(IdGenerator.getGenerationId());
        return variantOptionsMapper.convertEntityToDTO(variantOptionsRepository.save(variantOptions));
    }

    @Override
    public VariantOptionsDTO updateVariantOption(VariantOptionsUpdateDTO variantOptionsUpdateDTO, Integer id) {
        VariantOptions existingVariantOption = getVariantOptionEntityById(id);
        if(variantOptionsUpdateDTO.getName() != null) {
            existingVariantOption.setName(variantOptionsUpdateDTO.getName());
        }
        return variantOptionsMapper.convertEntityToDTO(variantOptionsRepository.save(existingVariantOption));
    }

    @Override
    public List<VariantOptionsDTO> getVariantOptionByProductCategoryId(Integer id) {
        return variantOptionsMapper.convertPageToListDTO(variantOptionsRepository.findByProductCategoryId(id));
    }
}
