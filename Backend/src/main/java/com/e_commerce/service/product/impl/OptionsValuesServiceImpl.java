package com.e_commerce.service.product.impl;

import com.e_commerce.dto.product.optionValuesDTO.OptionValuesCreateDTO;
import com.e_commerce.dto.product.optionValuesDTO.OptionValuesDTO;
import com.e_commerce.dto.product.optionValuesDTO.OptionValuesUpdateDTO;
import com.e_commerce.entity.product.OptionValues;
import com.e_commerce.exceptions.CustomException;
import com.e_commerce.exceptions.ErrorResponse;
import com.e_commerce.mapper.product.OptionsValuesMapper;
import com.e_commerce.orther.IdGenerator;
import com.e_commerce.repository.product.OptionsValuesRepository;
import com.e_commerce.service.product.OptionsValuesService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
public class OptionsValuesServiceImpl implements OptionsValuesService {
    private final OptionsValuesMapper optionsValuesMapper;
    private final OptionsValuesRepository optionsValuesRepository;

    @Override
    public OptionValues getVariantValueEntityById(Integer id) {
        return optionsValuesRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorResponse.OPTIONS_VALUE_NOT_FOUND));
    }

    @Override
    public OptionValuesDTO createVariantValue(OptionValuesCreateDTO optionValuesCreateDTO) {
        OptionValues variantValues = optionsValuesMapper.convertCreateDTOToEntity(optionValuesCreateDTO);
        variantValues.setId(IdGenerator.getGenerationId());
        return optionsValuesMapper.convertEntityToDTO(optionsValuesRepository.save(variantValues));
    }

    @Override
    public OptionValuesDTO updateVariantValue(OptionValuesUpdateDTO optionValuesUpdateDTO, Integer id) {
        OptionValues existingVariantValue = getVariantValueEntityById(id);
        if(optionValuesUpdateDTO.getValue() != null) {
            existingVariantValue.setName(optionValuesUpdateDTO.getValue());
        }
        if(optionValuesUpdateDTO.getPrice() != null) {
            existingVariantValue.setAdditionalPrice(optionValuesUpdateDTO.getPrice());
        }
        return optionsValuesMapper.convertEntityToDTO(optionsValuesRepository.save(existingVariantValue));

    }

    @Override
    public List<OptionValues> getVariantValueEntitiesById(List<Integer> id) {
        return optionsValuesRepository.findAllById(id);
    }

    @Override
    public List<OptionValuesDTO> getVariantValuesByVariantOptionId(Integer id) {
        return optionsValuesMapper.convertPageToListDTO(optionsValuesRepository.findByVariantOptionId(id));
    }

    @Transactional
    @Override
    public void decreaseStock(Integer optionValueId, int quantity) {
        int result = optionsValuesRepository.decreaseStock(optionValueId, quantity);
        if(result == 0) {
            throw new CustomException(ErrorResponse.OPTIONS_VALUE_OUT_OF_STOCK);
        }
    }
}
