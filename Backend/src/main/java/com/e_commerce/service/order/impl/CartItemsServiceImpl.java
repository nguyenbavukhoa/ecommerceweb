package com.e_commerce.service.order.impl;

import com.e_commerce.dto.order.cartItemDTO.CartItemCreateForm;
import com.e_commerce.dto.order.cartItemDTO.CartItemDTO;
import com.e_commerce.dto.order.cartItemDTO.CartItemUpdateForm;
import com.e_commerce.entity.order.CartItems;
import com.e_commerce.entity.order.Carts;
import com.e_commerce.entity.product.ProductVariants;
import com.e_commerce.mapper.order.CartItemMapper;
import com.e_commerce.orther.IdGenerator;
import com.e_commerce.repository.order.CartItemsRepository;
import com.e_commerce.service.order.CartItemsService;
import com.e_commerce.service.order.CartsService;
import com.e_commerce.service.product.ProductVariantsService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class CartItemsServiceImpl implements CartItemsService {
    private final CartItemMapper cartItemMapper;
    private final CartItemsRepository cartItemsRepository;
    private final CartsService cartsService;
    private final ProductVariantsService productVariantsService;

    @Override
    public CartItems getCartItemsById(Integer id) {
        return cartItemsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CartItems not found with id: " + id));
    }

    @Override
    public CartItemDTO createCartItems(CartItemCreateForm cartItemCreateForm) {
        Carts carts = cartsService.getCartsEntityById(cartItemCreateForm.getCartId());

        ProductVariants productVariants = productVariantsService.getProductVariantEntityById(cartItemCreateForm.getProductVariantsId());

        CartItems existingCartItem = cartItemsRepository.findByCartIdAndProductVariantId(carts.getId(), productVariants.getId()).orElse(null);

        if (existingCartItem != null) {
            existingCartItem.setQuantity(existingCartItem.getQuantity() + cartItemCreateForm.getQuantity());
            return cartItemMapper.convertEntityToDTO(cartItemsRepository.save(existingCartItem));
        }

        if(cartItemCreateForm.getQuantity() <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }

        CartItems cartItems = cartItemMapper.convertCreateDTOToEntity(cartItemCreateForm);
        cartItems.setId(IdGenerator.getGenerationId());
        cartItems.setCart(carts);
        cartItems.setProductVariant(productVariants);
        cartItems.setQuantity(cartItemCreateForm.getQuantity());

        return cartItemMapper.convertEntityToDTO(cartItemsRepository.save(cartItems));
    }

    @Override
    public CartItemDTO updateCartItems(Integer id, CartItemUpdateForm cartItemUpdateForm) {
        CartItems existingCartItems = getCartItemsById(id);
        if(cartItemUpdateForm.getQuantity() != null) {
            if(cartItemUpdateForm.getQuantity() <= 0) {
                throw new RuntimeException("Quantity must be greater than 0");
            }
            existingCartItems.setQuantity(cartItemUpdateForm.getQuantity());
        }
        return cartItemMapper.convertEntityToDTO(cartItemsRepository.save(existingCartItems));

    }

    @Override
    public List<CartItemDTO> getCartItemsByAccountId(Integer accountId) {
        return cartItemMapper.convertPageToList(cartItemsRepository.findByAccountId(accountId));
    }

    @Override
    public void deleteCartItems(Integer id, Integer productVariantId) {
        CartItems cartItems = cartItemsRepository.findByCartIdAndProductVariantId(id, productVariantId)
                .orElseThrow(() -> new RuntimeException("CartItems not found with cart id: " + id + " and product variant id: " + productVariantId));
        cartItemsRepository.delete(cartItems);
    }

    @Override
    public void deleteAllCartItemsByAccountId(Integer accountId) {
        cartItemsRepository.deleteAllByAccountId(accountId);
    }
}
