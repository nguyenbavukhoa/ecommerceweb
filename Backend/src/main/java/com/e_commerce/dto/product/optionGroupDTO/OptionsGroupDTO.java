package com.e_commerce.dto.product.optionGroupDTO;

import com.e_commerce.dto.product.optionValuesDTO.OptionValuesDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OptionsGroupDTO {
    private Integer id;
    private String name;

    private List<OptionValuesDTO> values;
}
