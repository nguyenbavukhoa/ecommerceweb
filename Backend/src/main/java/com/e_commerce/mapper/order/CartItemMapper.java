package com.e_commerce.mapper.order;

import com.e_commerce.dto.order.cartItemDTO.CartItemCreateForm;
import com.e_commerce.dto.order.cartItemDTO.CartItemDTO;
import com.e_commerce.entity.order.CartItems;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CartItemMapper {
    public CartItemDTO convertEntityToDTO(CartItems cartItem) {
        return CartItemDTO.builder()
                .cartId(cartItem.getCart().getId())
                .productVariantsId(cartItem.getProductVariant().getId())
                .quantity(cartItem.getQuantity())
                .variantValuesId(cartItem.getVariantValue() != null ? cartItem.getVariantValue().getId() : null)
                .imgUrl(cartItem.getProductVariant().getImgUrl())
                .productName(cartItem.getProductVariant().getProduct().getName())
                .price(cartItem.getProductVariant().getPrice())
                .note(cartItem.getNote())
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
                .toList();
    }

    public CartItemCreateForm convertEntityToCreateDTO(CartItems cartItem) {
        return CartItemCreateForm.builder()
                .productVariantsId(cartItem.getProductVariant().getId())
                .quantity(cartItem.getQuantity())
                .build();
    }

    public List<CartItems> convertCreateDTOListToEntityList(List<CartItemCreateForm> cartItemCreateForms) {
        return cartItemCreateForms.stream()
                .map(this::convertCreateDTOToEntity)
                .toList();
    }
}
