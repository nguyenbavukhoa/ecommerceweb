package com.e_commerce.service.order;

import com.e_commerce.dto.order.orderItemsDTO.OrderItemsCreateForm;
import com.e_commerce.dto.order.orderItemsDTO.OrderItemsDTO;
import com.e_commerce.entity.order.CartItems;
import com.e_commerce.entity.order.OrderItems;
import com.e_commerce.entity.order.Orders;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface OrderItemsService {
    OrderItems getOrderItemsEntityById(Integer id);

    OrderItemsDTO createOrderItems(OrderItemsCreateForm orderItemsCreateForm);

    List<OrderItems> createOrderItemsFromCartItem(List<CartItems> cartItems, Orders order);

}
