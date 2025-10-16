package com.e_commerce.dto.order.orderItemsDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderItemsDTO {
    private Integer id;

    private Integer orderId;

    private Integer productId;

    private Integer quantity;

    private String imgUrl;

    private String productName;

    private BigDecimal price;

    private String note;
}
