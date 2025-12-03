package com.e_commerce.controller.orders;

import com.e_commerce.dto.ApiResponse;
import com.e_commerce.dto.PageDTO;
import com.e_commerce.dto.order.orderDTO.OrderCreateForm;
import com.e_commerce.dto.order.orderDTO.OrderDTO;
import com.e_commerce.dto.order.orderDTO.OrderFilter;
import com.e_commerce.enums.OrderStatus;
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

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<PageDTO<OrderDTO>>> getAllOrders(
            OrderFilter orderFilter,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size,
            HttpServletRequest request
    ){
        PageDTO<OrderDTO> result = orderService.getAllOrders(page,size,orderFilter);
        return ResponseEntity.ok(
                new ApiResponse<>(true,"Get order successfully",result,null,request.getRequestURI()));
    }


    @PostMapping("createOrderByAdmin")
    public ResponseEntity<ApiResponse<OrderDTO>> createOrderByAdmin(@RequestBody @Valid OrderCreateForm orderCreateForm, HttpServletRequest request){
        OrderDTO orders = orderService.createOrder(orderCreateForm);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true,"Create order successfully",orders,null,request.getRequestURI()));
    }

    @PatchMapping("/update-status/{orderId}")
    public ResponseEntity<ApiResponse<OrderDTO>> updateOrderStatus(
            @PathVariable Integer orderId,
            @RequestParam OrderStatus status,
            HttpServletRequest request
    ){
        OrderDTO updatedOrder = orderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok(
                new ApiResponse<>(true,"Update order status successfully",updatedOrder,null,request.getRequestURI()));
    }

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<ApiResponse<PageDTO<OrderDTO>>> getOrdersByRestaurant(
            @PathVariable Integer restaurantId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size,
            HttpServletRequest request
    ){
        PageDTO<OrderDTO> result = orderService.getOrdersByRestaurant(page,size,restaurantId);
        return ResponseEntity.ok(
                new ApiResponse<>(true,"Get orders by restaurant successfully",result,null,request.getRequestURI()));
    }

    @DeleteMapping("/delete/{orderId}")
    public ResponseEntity<ApiResponse<Void>> deleteOrder(
            @PathVariable Integer orderId,
            HttpServletRequest request
    ){
        orderService.deleteOrder(orderId);
        return ResponseEntity.ok(
                new ApiResponse<>(true,"Delete order successfully",null,null,request.getRequestURI()));
    }

}
