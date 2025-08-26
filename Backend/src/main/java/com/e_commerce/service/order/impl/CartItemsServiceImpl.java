package com.e_commerce.service.order.impl;

import com.e_commerce.dto.order.cartItemDTO.CartItemCreateForm;
import com.e_commerce.dto.order.cartItemDTO.CartItemDTO;
import com.e_commerce.dto.order.cartItemDTO.CartItemUpdateForm;
import com.e_commerce.entity.order.CartItems;
import com.e_commerce.mapper.order.CartItemMapper;
import com.e_commerce.orther.IdGenerator;
import com.e_commerce.repository.order.CartItemsRepository;
import com.e_commerce.service.order.CartItemsService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class CartItemsServiceImpl implements CartItemsService {
    private final CartItemMapper cartItemMapper;
    private final CartItemsRepository cartItemsRepository;

    @Override
    public CartItems getCartItemsById(Integer id) {
        return cartItemsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CartItems not found with id: " + id));
    }

    @Override
    public CartItemDTO createCartItems(CartItemCreateForm cartItemCreateForm) {
        CartItems cartItems = cartItemMapper.convertCreateDTOToEntity(cartItemCreateForm);
        cartItems.setId(IdGenerator.getGenerationId());
        return cartItemMapper.convertEntityToDTO(cartItemsRepository.save(cartItems));
    }

    @Override
    public CartItemDTO updateCartItems(Integer id, CartItemUpdateForm cartItemUpdateForm) {
        CartItems existingCartItems = getCartItemsById(id);
        if(cartItemUpdateForm.getQuantity() != null) {
            existingCartItems.setQuantity(cartItemUpdateForm.getQuantity());
        }
        return cartItemMapper.convertEntityToDTO(cartItemsRepository.save(existingCartItems));

    }
}
