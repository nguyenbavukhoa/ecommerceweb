package com.e_commerce.controller.orders;

import com.e_commerce.dto.ApiResponse;
import com.e_commerce.dto.order.orderStatusHistoryDTO.OrderStatusHistoryDTO;
import com.e_commerce.service.order.OrderStatusHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/order-status-history")
@RequiredArgsConstructor
public class OrderStatusHistoryController {
    private final OrderStatusHistoryService orderStatusHistoryService;

    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<List<OrderStatusHistoryDTO>>> getOrderHistory(@PathVariable Integer orderId) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Get order status history successfully", orderStatusHistoryService.getHistoryByOrderId(orderId), null, "/order-status-history/" + orderId));
    }

}
