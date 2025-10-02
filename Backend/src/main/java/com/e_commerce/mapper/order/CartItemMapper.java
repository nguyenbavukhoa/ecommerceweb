package com.e_commerce.mapper.order;

import com.e_commerce.dto.order.cartItemDTO.CartItemCreateForm;
import com.e_commerce.dto.order.cartItemDTO.CartItemDTO;
import com.e_commerce.entity.order.CartItems;
import com.e_commerce.entity.product.VariantValues;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class CartItemMapper {
    public CartItemDTO convertEntityToDTO(CartItems cartItem) {
        return CartItemDTO.builder()
                .id(cartItem.getId())
                .cartId(cartItem.getCart().getId())
                .productVariantsId(cartItem.getProductVariant().getId())
                .quantity(cartItem.getQuantity())
                .variantValuesId(cartItem.getVariantValue() != null
                        ? cartItem.getVariantValue()
                        .stream()
                        .map(VariantValues::getId)
                        .collect(Collectors.toList())
                        : List.of())
                .imgUrl(cartItem.getProductVariant().getImgUrl())
                .productName(cartItem.getProductVariant().getProduct().getName())
                .price(cartItem.getPrice())
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
