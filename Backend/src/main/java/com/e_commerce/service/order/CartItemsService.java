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

    List<CartItemDTO> getAll();

    void deleteCartItems(List<Integer> id);

    void deleteAllCartItemsByAccountId();

    List<CartItems> getSelectedCartItemsByCartIdAndId(List<Integer> cartItemId);

    List<CartItems> getCartItemsByCartId(Integer cartId);

    CartItemDTO changeSelectedCartItem(Integer id, boolean selected);

    List<CartItemDTO> getCartItemsAllSelected();

    CartItemDTO updateCartItemQuantity(Integer id, int newQuantity);
}
