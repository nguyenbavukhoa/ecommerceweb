package com.e_commerce.dto.order.orderDTO;

import lombok.Data;

@Data
public class OrderFilter {
    private String orderStatus;

    private String startDate;

    private String endDate;

    private Integer minTotalPrice;

    private Integer maxTotalPrice;

}
