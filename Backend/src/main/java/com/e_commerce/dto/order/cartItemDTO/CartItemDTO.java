package com.e_commerce.dto.order.cartItemDTO;

import com.e_commerce.dto.product.optionValuesDTO.OptionValuesDTO;
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

    private List<OptionValuesDTO> optionValuesDTO;
    private String note;

    private Integer cartId;
    private boolean selected;
}
