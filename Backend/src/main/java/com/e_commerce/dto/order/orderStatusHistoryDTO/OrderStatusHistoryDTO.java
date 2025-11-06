package com.e_commerce.dto.order.orderStatusHistoryDTO;

import com.e_commerce.enums.OrderStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderStatusHistoryDTO {
    private Integer id;

    private Integer orderId;

    private OrderStatus status;

    @JsonFormat(pattern = "hh:mm:ss dd/MM/yyyy", timezone = "Asia/Ho_Chi_Minh")
    private LocalDateTime changedAt;

}
