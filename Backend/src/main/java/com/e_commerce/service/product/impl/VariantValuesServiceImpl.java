package com.e_commerce.service.product.impl;

import com.e_commerce.dto.product.optionValuesDTO.OptionValuesCreateDTO;
import com.e_commerce.dto.product.optionValuesDTO.OptionValuesDTO;
import com.e_commerce.dto.product.optionValuesDTO.OptionValuesUpdateDTO;
import com.e_commerce.entity.product.VariantValues;
import com.e_commerce.exceptions.CustomException;
import com.e_commerce.exceptions.ErrorResponse;
import com.e_commerce.mapper.product.VariantValuesMapper;
import com.e_commerce.orther.IdGenerator;
import com.e_commerce.repository.product.VariantValuesRepository;
import com.e_commerce.service.product.VariantValuesService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class VariantValuesServiceImpl implements VariantValuesService {
    private final VariantValuesMapper variantValuesMapper;
    private final VariantValuesRepository variantValuesRepository;

    @Override
    public VariantValues getVariantValueEntityById(Integer id) {
        return variantValuesRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorResponse.VARIANT_VALUE_NOT_FOUND));
    }

    @Override
    public OptionValuesDTO createVariantValue(OptionValuesCreateDTO optionValuesCreateDTO) {
        VariantValues variantValues = variantValuesMapper.convertCreateDTOToEntity(optionValuesCreateDTO);
        variantValues.setId(IdGenerator.getGenerationId());
        return variantValuesMapper.convertEntityToDTO(variantValuesRepository.save(variantValues));
    }

    @Override
    public OptionValuesDTO updateVariantValue(OptionValuesUpdateDTO optionValuesUpdateDTO, Integer id) {
        VariantValues existingVariantValue = getVariantValueEntityById(id);
        if(optionValuesUpdateDTO.getValue() != null) {
            existingVariantValue.setValue(optionValuesUpdateDTO.getValue());
        }
        if(optionValuesUpdateDTO.getPrice() != null) {
            existingVariantValue.setPrice(optionValuesUpdateDTO.getPrice());
        }
        return variantValuesMapper.convertEntityToDTO(variantValuesRepository.save(existingVariantValue));

    }

    @Override
    public List<VariantValues> getVariantValueEntitiesById(List<Integer> id) {
        return variantValuesRepository.findAllById(id);
    }

    @Override
    public List<OptionValuesDTO> getVariantValuesByVariantOptionId(Integer id) {
        return variantValuesMapper.convertPageToListDTO(variantValuesRepository.findByVariantOptionId(id));
    }
}
