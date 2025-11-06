package com.e_commerce.dto.product.optionGroupDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OptionsGroupUpdateDTO {
    private String name;
}
