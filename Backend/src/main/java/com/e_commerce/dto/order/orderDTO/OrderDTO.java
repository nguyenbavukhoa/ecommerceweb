package com.e_commerce.dto.order.orderDTO;

import com.e_commerce.dto.auth.userInfoDTO.UserInfoDTO;
import com.e_commerce.dto.order.orderItemsDTO.OrderItemsDTO;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderDTO {
    private Integer id;

    private String orderStatus;

    private BigDecimal totalPrice;

    @JsonFormat(pattern = "HH:mm:ss dd/MM/yyyy")
    private LocalDateTime orderTime;

    private String note;

    private List<OrderItemsDTO> orderItems;

    private Integer storeId;

    private UserInfoDTO userInfo;
}
