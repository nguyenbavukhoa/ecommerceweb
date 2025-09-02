package com.e_commerce.service.product;

import com.e_commerce.dto.product.variantValuesDTO.VariantValuesCreateDTO;
import com.e_commerce.dto.product.variantValuesDTO.VariantValuesDTO;
import com.e_commerce.dto.product.variantValuesDTO.VariantValuesUpdateDTO;
import com.e_commerce.entity.product.VariantValues;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface VariantValuesService {
    VariantValues getVariantValueEntityById(Integer id);

    VariantValuesDTO createVariantValue(VariantValuesCreateDTO variantValuesCreateDTO);

    VariantValuesDTO updateVariantValue(VariantValuesUpdateDTO variantValuesUpdateDTO, Integer id);

}
