package com.e_commerce.service.order;

import com.e_commerce.dto.order.orderItemsDTO.OrderItemsCreateForm;
import com.e_commerce.dto.order.orderItemsDTO.OrderItemsDTO;
import com.e_commerce.entity.order.OrderItems;
import org.springframework.stereotype.Service;

@Service
public interface OrderItemsService {
    OrderItems getOrderItemsEntityById(Integer id);

    OrderItemsDTO createOrderItems(OrderItemsCreateForm orderItemsCreateForm);


}
