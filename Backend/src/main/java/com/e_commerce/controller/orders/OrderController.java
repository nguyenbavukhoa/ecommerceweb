package com.e_commerce.controller.orders;

import com.e_commerce.dto.ApiResponse;
import com.e_commerce.dto.order.orderDTO.OrderCreateForm;
import com.e_commerce.dto.order.orderDTO.OrderDTO;
import com.e_commerce.entity.order.Orders;
import com.e_commerce.service.order.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@Slf4j
public class OrderController {
    private final OrderService orderService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<OrderDTO>> create(@RequestBody @Valid OrderCreateForm orderCreateForm, HttpServletRequest request){
        log.info("Received order creation request: {}", orderCreateForm);
        OrderDTO orders = orderService.createOrder(orderCreateForm);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true,"Create order successfully",orders,null,request.getRequestURI()));
    }
}
