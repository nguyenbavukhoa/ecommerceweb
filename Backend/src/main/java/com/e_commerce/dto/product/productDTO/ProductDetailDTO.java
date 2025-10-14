package com.e_commerce.dto.product.productDTO;

import com.e_commerce.dto.product.optionGroupDTO.OptionsGroupDTO;
import com.e_commerce.enums.AvailabilityStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductDetailDTO {
    private Integer id;
    private String name;
    private String description;
    private BigDecimal basePrice;
    private String imgUrl;
    private AvailabilityStatus status;

    private List<OptionsGroupDTO> optionGroups;
}
