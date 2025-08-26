package com.e_commerce.service.order.impl;

import com.e_commerce.dto.order.orderItemsDTO.OrderItemsCreateForm;
import com.e_commerce.dto.order.orderItemsDTO.OrderItemsDTO;
import com.e_commerce.entity.order.OrderItems;
import com.e_commerce.mapper.order.OrderItemMapper;
import com.e_commerce.orther.IdGenerator;
import com.e_commerce.repository.order.OrderItemsRepository;
import com.e_commerce.service.order.OrderItemsService;
import lombok.AllArgsConstructor;
import org.hibernate.query.Order;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class OrderItemsServiceImpl implements OrderItemsService {
    private final OrderItemMapper orderItemMapper;
    private final OrderItemsRepository orderItemsRepository;

    @Override
    public OrderItems getOrderItemsEntityById(Integer id) {
        return orderItemsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("OrderItems not found with id: " + id));
    }

    @Override
    public OrderItemsDTO createOrderItems(OrderItemsCreateForm orderItemsCreateForm) {
        OrderItems orderItems = orderItemMapper.convertCreateDTOToEntity(orderItemsCreateForm);
        orderItems.setId(IdGenerator.getGenerationId());
        return orderItemMapper.convertEntityToDTO(orderItemsRepository.save(orderItems));
    }
}
