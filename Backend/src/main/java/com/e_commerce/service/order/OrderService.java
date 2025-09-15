package com.e_commerce.service.order;

import com.e_commerce.dto.order.cartDTO.CheckoutForm;
import com.e_commerce.dto.order.orderDTO.OrderCreateForm;
import com.e_commerce.dto.order.orderDTO.OrderDTO;
import com.e_commerce.entity.order.Orders;
import com.e_commerce.enums.OrderStatus;
import org.springframework.stereotype.Service;

@Service
public interface OrderService {
    Orders getOrderEntityById(Integer id);

    OrderDTO createOrder(OrderCreateForm orderCreateForm);

    Orders createOrderFromEntireCart(String orderNote);

    OrderDTO checkout(CheckoutForm checkoutForm);

    Orders getOrder();

    void confirmOrderAfterPayment(Orders order);

    OrderDTO updateOrderStatus(Integer orderId, OrderStatus status);
}
