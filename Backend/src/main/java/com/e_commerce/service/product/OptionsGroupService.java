package com.e_commerce.service.product;

import com.e_commerce.dto.product.optionGroupDTO.OptionsGroupCreateDTO;
import com.e_commerce.dto.product.optionGroupDTO.OptionsGroupDTO;
import com.e_commerce.dto.product.optionGroupDTO.OptionsGroupUpdateDTO;
import com.e_commerce.entity.product.OptionGroup;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface OptionsGroupService {
    OptionGroup getVariantOptionEntityById(Integer id);

    OptionsGroupDTO createVariantOption(OptionsGroupCreateDTO optionsGroupCreateDTO);

    OptionsGroupDTO updateVariantOption(OptionsGroupUpdateDTO optionsGroupUpdateDTO, Integer id);

    List<OptionsGroupDTO> getOptionGroupsByProductId(Integer id);
}
