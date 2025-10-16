package com.e_commerce.dto.order.cartItemDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartItemDeleteForm {
    private Integer productId;

    private Integer cartId;
}
