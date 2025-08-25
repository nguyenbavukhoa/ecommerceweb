package com.e_commerce.dto.order.orderDTO;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderDTO {
    private Integer id;

    private String orderStatus;

    private String totalPrice;

    @JsonFormat(pattern = "HH:mm:ss dd/MM/yyyy")
    private LocalDateTime orderTime;
}
