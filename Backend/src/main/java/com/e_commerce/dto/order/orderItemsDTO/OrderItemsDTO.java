package com.e_commerce.dto.order.orderItemsDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemsDTO {
    private Integer id;

    private Integer orderId;

    private Integer productVariantsId;

    private Integer quantity;
}
