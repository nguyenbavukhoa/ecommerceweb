package com.e_commerce.service.order.impl;

import com.e_commerce.dto.order.orderDTO.OrderCreateForm;
import com.e_commerce.dto.order.orderDTO.OrderDTO;
import com.e_commerce.entity.order.Orders;
import com.e_commerce.mapper.order.OrdersMapper;
import com.e_commerce.orther.IdGenerator;
import com.e_commerce.repository.order.OrdersRepository;
import com.e_commerce.service.order.OrderService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final OrdersMapper ordersMapper;
    private final OrdersRepository ordersRepository;

    @Override
    public Orders getOrderEntityById(Integer id) {
        return ordersRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }

    @Override
    public OrderDTO createOrder(OrderCreateForm orderCreateForm) {
        Orders order = ordersMapper.convertCreateDTOToEntity(orderCreateForm);
        order.setId(IdGenerator.getGenerationId());
        return ordersMapper.convertEntityToDTO(ordersRepository.save(order));
    }
}
