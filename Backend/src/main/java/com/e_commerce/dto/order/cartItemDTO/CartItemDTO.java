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
    private String productName;
    private String imgUrl;

    private Integer quantity;
    private BigDecimal price;
    private BigDecimal totalPrice;

    private List<String> optionValueNames;
    private String note;

    private Integer cartId;
    private boolean selected;
}
