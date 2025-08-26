package com.e_commerce.service.order;

import com.e_commerce.dto.order.orderDTO.OrderCreateForm;
import com.e_commerce.dto.order.orderDTO.OrderDTO;
import com.e_commerce.entity.order.Orders;
import org.springframework.stereotype.Service;

@Service
public interface OrderService {
    Orders getOrderEntityById(Integer id);

    OrderDTO createOrder(OrderCreateForm orderCreateForm);
}
