package com.e_commerce.service.order.impl;

import com.e_commerce.dto.order.cartDTO.CartCreateForm;
import com.e_commerce.dto.order.cartDTO.CartDTO;
import com.e_commerce.entity.order.Carts;
import com.e_commerce.mapper.order.CartsMapper;
import com.e_commerce.orther.IdGenerator;
import com.e_commerce.repository.order.CartsRepository;
import com.e_commerce.service.order.CartsService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class CartsServiceImpl implements CartsService {
    private final CartsRepository cartsRepository;
    private final CartsMapper cartsMapper;

    @Override
    public Carts getCartsEntityById(Integer id) {
        return cartsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Carts not found with id: " + id));
    }

    @Override
    public CartDTO createCarts(CartCreateForm cartCreateForm) {
        Carts carts = cartsMapper.convertCreateDTOToEntity(cartCreateForm);
        carts.setId(IdGenerator.getGenerationId());
        return cartsMapper.convertEntityToDTO(cartsRepository.save(carts));
    }
}
