package com.e_commerce.service.order.impl;

import com.e_commerce.dto.order.cartDTO.CartDTO;
import com.e_commerce.dto.order.cartItemDTO.CartItemCreateForm;
import com.e_commerce.dto.order.cartItemDTO.CartItemDTO;
import com.e_commerce.dto.order.cartItemDTO.CartItemUpdateForm;
import com.e_commerce.entity.order.CartItems;
import com.e_commerce.entity.order.Carts;
import com.e_commerce.entity.product.ProductVariants;
import com.e_commerce.entity.product.VariantValues;
import com.e_commerce.mapper.order.CartItemMapper;
import com.e_commerce.orther.IdGenerator;
import com.e_commerce.repository.order.CartItemsRepository;
import com.e_commerce.service.order.CartItemsService;
import com.e_commerce.service.order.CartsService;
import com.e_commerce.service.product.ProductVariantsService;
import com.e_commerce.service.product.ProductVariantsValuesService;
import com.e_commerce.service.product.VariantValuesService;
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
    private final ProductVariantsValuesService productVariantsValuesService;
    private final VariantValuesService variantValuesService;

    @Override
    public CartItems getCartItemsById(Integer id) {
        return cartItemsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CartItems not found with id: " + id));
    }

    @Override
    public CartItemDTO addToCart(CartItemCreateForm cartItemCreateForm) {
        if(cartItemCreateForm.getQuantity() <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }

        CartDTO cartDTO = cartsService.getOrCreateCartForUser(cartItemCreateForm.getAccountId());
        Carts carts = cartsService.getCartsEntityById(cartDTO.getId());

        ProductVariants productVariants = productVariantsService.getProductVariantEntityById(cartItemCreateForm.getProductVariantsId());

        VariantValues variantValues = cartItemCreateForm.getVariantValuesId() != null
                ? variantValuesService.getVariantValueEntityById(cartItemCreateForm.getVariantValuesId())
                : null;


        CartItems existingCartItem = cartItemsRepository.findByCartIdAndProductVariantIdAndVariantValueId(
                carts.getId(),
                productVariants.getId(),
                variantValues != null ? variantValues.getId() : null
        ).orElse(null);

        int existingQuantity = existingCartItem != null ? existingCartItem.getQuantity() : 0;
        int totalRequestedQuantity = existingQuantity + cartItemCreateForm.getQuantity();

        boolean available = variantValues != null
                ? productVariantsValuesService.isVariantValueAvailable(
                    productVariants.getId(),
                    variantValues.getId(),
                    totalRequestedQuantity
            )
                : productVariantsValuesService.checkProductVariantAvailability(
                    productVariants.getId(),
                    totalRequestedQuantity
            );

        if(!available) {
            // viet lai exception
        }

        if (existingCartItem != null) {
            existingCartItem.setQuantity(totalRequestedQuantity);
            return cartItemMapper.convertEntityToDTO(cartItemsRepository.save(existingCartItem));
        }


        CartItems cartItems = cartItemMapper.convertCreateDTOToEntity(cartItemCreateForm);
        cartItems.setId(IdGenerator.getGenerationId());
        cartItems.setCart(carts);
        cartItems.setProductVariant(productVariants);
        cartItems.setQuantity(cartItemCreateForm.getQuantity());
        cartItems.setVariantValue(variantValues);

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
        return cartItemMapper.convertPageToList(cartItemsRepository.findByCart_Account_Id(accountId));
    }

    @Override
    public void deleteCartItems(Integer id, Integer productVariantId) {
        CartItems cartItems = cartItemsRepository.findByCartIdAndProductVariantId(id, productVariantId)
                .orElseThrow(() -> new RuntimeException("CartItems not found with cart id: " + id + " and product variant id: " + productVariantId));
        cartItemsRepository.delete(cartItems);
    }

    @Override
    public void deleteAllCartItemsByAccountId(Integer accountId) {
        cartItemsRepository.deleteAllByCart_Account_Id(accountId);
    }
}
