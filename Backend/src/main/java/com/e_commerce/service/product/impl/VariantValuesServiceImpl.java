package com.e_commerce.service.product.impl;

import com.e_commerce.dto.product.variantValuesDTO.VariantValuesCreateDTO;
import com.e_commerce.dto.product.variantValuesDTO.VariantValuesDTO;
import com.e_commerce.dto.product.variantValuesDTO.VariantValuesUpdateDTO;
import com.e_commerce.entity.product.VariantValues;
import com.e_commerce.mapper.product.VariantValuesMapper;
import com.e_commerce.orther.IdGenerator;
import com.e_commerce.repository.product.VariantValuesRepository;
import com.e_commerce.service.product.VariantValuesService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class VariantValuesServiceImpl implements VariantValuesService {
    private final VariantValuesMapper variantValuesMapper;
    private final VariantValuesRepository variantValuesRepository;

    @Override
    public VariantValues getVariantValueEntityById(Integer id) {
        return variantValuesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Variant value not found with id: " + id));
    }

    @Override
    public VariantValuesDTO createVariantValue(VariantValuesCreateDTO variantValuesCreateDTO) {
        VariantValues variantValues = variantValuesMapper.convertCreateDTOToEntity(variantValuesCreateDTO);
        variantValues.setId(IdGenerator.getGenerationId());
        return variantValuesMapper.convertEntityToDTO(variantValuesRepository.save(variantValues));
    }

    @Override
    public VariantValuesDTO updateVariantValue(VariantValuesUpdateDTO variantValuesUpdateDTO, Integer id) {
        VariantValues existingVariantValue = getVariantValueEntityById(id);
        if(variantValuesUpdateDTO.getValue() != null) {
            existingVariantValue.setValue(variantValuesUpdateDTO.getValue());
        }
        if(variantValuesUpdateDTO.getPrice() != null) {
            existingVariantValue.setPrice(variantValuesUpdateDTO.getPrice());
        }
        return variantValuesMapper.convertEntityToDTO(variantValuesRepository.save(existingVariantValue));

    }
}
