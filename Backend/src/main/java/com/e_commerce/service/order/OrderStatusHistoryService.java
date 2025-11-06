package com.e_commerce.service.order;

import com.e_commerce.dto.order.orderStatusHistoryDTO.OrderStatusHistoryDTO;
import com.e_commerce.entity.order.Orders;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface OrderStatusHistoryService {
    List<OrderStatusHistoryDTO> getHistoryByOrderId(Integer orderId);

    void save(Orders order, String note);
}
