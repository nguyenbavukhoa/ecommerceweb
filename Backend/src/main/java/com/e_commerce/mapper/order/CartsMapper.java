package com.e_commerce.mapper.order;

import com.e_commerce.dto.order.cartDTO.CartCreateForm;
import com.e_commerce.dto.order.cartDTO.CartDTO;
import com.e_commerce.entity.order.Carts;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class CartsMapper {
    private final CartItemMapper cartItemMapper;
    public CartDTO convertEntityToDTO(Carts cart) {
        return CartDTO.builder()
                .id(cart.getId())
                .userId(cart.getAccount().getId())
                .build();
    }

    public Carts convertCreateDTOToEntity(CartCreateForm cartCreateForm) {
        return Carts.builder()
                .cartItems(cartItemMapper.convertCreateDTOListToEntityList(cartCreateForm.getListCartItems()))
                .build();
    }
}
