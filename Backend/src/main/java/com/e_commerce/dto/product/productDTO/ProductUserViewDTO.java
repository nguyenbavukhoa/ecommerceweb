package com.e_commerce.dto.product.productDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductUserViewDTO {
    private Integer id;

    private String name;

    private boolean isActive;

    private String imgMain;

    private BigDecimal priceBase;
}
