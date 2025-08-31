package com.e_commerce.service.order;

import com.e_commerce.dto.order.cartItemDTO.CartItemCreateForm;
import com.e_commerce.dto.order.cartItemDTO.CartItemDTO;
import com.e_commerce.dto.order.cartItemDTO.CartItemUpdateForm;
import com.e_commerce.entity.order.CartItems;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CartItemsService {
    CartItems getCartItemsById(Integer id);

    CartItemDTO addToCart(CartItemCreateForm cartItemCreateForm);

    CartItemDTO updateCartItems(Integer id, CartItemUpdateForm cartItemUpdateForm);

    List<CartItemDTO> getCartItemsByAccountId(Integer accountId);

    void deleteCartItems(Integer id, Integer productVariantId);

    void deleteAllCartItemsByAccountId(Integer accountId);
}
