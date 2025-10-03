package com.e_commerce.service.product;

import com.e_commerce.dto.product.variantOptionsDTO.VariantOptionsCreateDTO;
import com.e_commerce.dto.product.variantOptionsDTO.VariantOptionsDTO;
import com.e_commerce.dto.product.variantOptionsDTO.VariantOptionsUpdateDTO;
import com.e_commerce.entity.product.VariantOptions;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface VariantOptionsService {
    VariantOptions getVariantOptionEntityById(Integer id);

    VariantOptionsDTO createVariantOption(VariantOptionsCreateDTO variantOptionsCreateDTO);

    VariantOptionsDTO updateVariantOption(VariantOptionsUpdateDTO variantOptionsUpdateDTO, Integer id);

    List<VariantOptionsDTO> getVariantOptionByProductCategoryId(Integer id);
}
