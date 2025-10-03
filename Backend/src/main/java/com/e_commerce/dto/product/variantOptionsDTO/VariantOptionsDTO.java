package com.e_commerce.dto.product.variantOptionsDTO;

import com.e_commerce.dto.product.variantValuesDTO.VariantValuesDTO;
import com.e_commerce.entity.product.ProductCategories;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VariantOptionsDTO {
    private Integer id;
    private String name;

    private List<VariantValuesDTO> values;
}
