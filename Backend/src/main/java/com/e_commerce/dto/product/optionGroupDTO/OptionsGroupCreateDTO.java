package com.e_commerce.dto.product.optionGroupDTO;

import com.e_commerce.enums.SelectionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OptionsGroupCreateDTO {
    private String name;
    private Integer productId;
    private SelectionType selectionType;
}
