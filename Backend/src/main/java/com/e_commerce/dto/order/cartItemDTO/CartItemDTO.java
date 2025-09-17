package com.e_commerce.dto.order.cartItemDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartItemDTO {
    private Integer productVariantsId;

    private Integer quantity;

    private Integer cartId;

    private Integer variantValuesId;

    private String imgUrl;

    private String productName;

    private BigDecimal price;

    private String note;
}
