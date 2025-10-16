package com.e_commerce.service.product;

import com.e_commerce.dto.product.optionValuesDTO.OptionValuesCreateDTO;
import com.e_commerce.dto.product.optionValuesDTO.OptionValuesDTO;
import com.e_commerce.dto.product.optionValuesDTO.OptionValuesUpdateDTO;
import com.e_commerce.entity.product.OptionValues;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface OptionsValuesService {
    OptionValues getVariantValueEntityById(Integer id);

    OptionValuesDTO createVariantValue(OptionValuesCreateDTO optionValuesCreateDTO);

    OptionValuesDTO updateVariantValue(OptionValuesUpdateDTO optionValuesUpdateDTO, Integer id);

    List<OptionValues> getVariantValueEntitiesById(List<Integer> id);

    List<OptionValuesDTO> getVariantValuesByVariantOptionId(Integer id);

    void decreaseStock(Integer optionValueId, int quantity);
}
