package com.e_commerce.dto.order.cartItemDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartItemDTO {
    private Integer id;

    private Integer productId;

    private Integer quantity;

    private Integer cartId;

    private List<Integer> optionValueId;

    private String imgUrl;

    private String productName;

    private BigDecimal price;

    private String note;

    private boolean selected;
}
