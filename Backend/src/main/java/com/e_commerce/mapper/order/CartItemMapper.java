package com.e_commerce.mapper.order;

import com.e_commerce.dto.order.cartItemDTO.CartItemCreateForm;
import com.e_commerce.dto.order.cartItemDTO.CartItemDTO;
import com.e_commerce.entity.order.CartItems;
import com.e_commerce.entity.product.OptionValues;
import com.e_commerce.mapper.product.OptionsValuesMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class CartItemMapper {
    private final OptionsValuesMapper optionValuesMapper;

    public CartItemDTO convertEntityToDTO(CartItems cartItem) {
        return CartItemDTO.builder()
                .id(cartItem.getId())
                .cartId(cartItem.getCart().getId())
                .productId(cartItem.getProduct().getId())
                .productName(cartItem.getProduct().getName())
                .quantity(cartItem.getQuantity())
                .imgUrl(cartItem.getProduct().getImgMain())
                .price(cartItem.getPrice())
                .note(cartItem.getNote())
                .selected(cartItem.isSelected())
                .optionValuesDTO(optionValuesMapper.convertPageToListDTO(cartItem.getSelectedOptions()))
                .build();
    }

    public CartItems convertCreateDTOToEntity(CartItemCreateForm cartItemCreateForm) {
        return CartItems.builder()
                .quantity(cartItemCreateForm.getQuantity())
                .build();
    }

    public List<CartItemDTO> convertPageToList(List<CartItems> cartItems) {
        return cartItems.stream()
                .map(this::convertEntityToDTO)
                .collect(Collectors.toList());
    }

    public CartItemCreateForm convertEntityToCreateDTO(CartItems cartItem) {
        return CartItemCreateForm.builder()
                .productId(cartItem.getProduct().getId())
                .quantity(cartItem.getQuantity())
                .build();
    }

    public List<CartItems> convertCreateDTOListToEntityList(List<CartItemCreateForm> cartItemCreateForms) {
        return cartItemCreateForms.stream()
                .map(this::convertCreateDTOToEntity)
                .collect(Collectors.toList());
    }
}
