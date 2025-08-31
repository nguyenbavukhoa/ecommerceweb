package com.e_commerce.service.order.impl;

import com.e_commerce.dto.order.cartDTO.CartDTO;
import com.e_commerce.dto.order.cartItemDTO.CartItemCreateForm;
import com.e_commerce.dto.order.cartItemDTO.CartItemDTO;
import com.e_commerce.dto.order.cartItemDTO.CartItemUpdateForm;
import com.e_commerce.entity.account.Account;
import com.e_commerce.entity.order.CartItems;
import com.e_commerce.entity.order.Carts;
import com.e_commerce.entity.product.ProductVariantValues;
import com.e_commerce.entity.product.ProductVariants;
import com.e_commerce.entity.product.VariantValues;
import com.e_commerce.mapper.order.CartItemMapper;
import com.e_commerce.orther.IdGenerator;
import com.e_commerce.repository.order.CartItemsRepository;
import com.e_commerce.service.account.AccountService;
import com.e_commerce.service.order.CartItemsService;
import com.e_commerce.service.order.CartsService;
import com.e_commerce.service.product.ProductVariantsService;
import com.e_commerce.service.product.ProductVariantsValuesService;
import com.e_commerce.service.product.VariantValuesService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
@Slf4j
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

        log.info("Creating or retrieving cart for the user...");
        log.info("CartItemCreateForm: {}", cartItemCreateForm);

        Carts carts = cartsService.createCarts();

        ProductVariants productVariants = productVariantsService.getProductVariantEntityById(cartItemCreateForm.getProductVariantsId());

        VariantValues variantValues = cartItemCreateForm.getVariantValuesId() != null
                ? variantValuesService.getVariantValueEntityById(cartItemCreateForm.getVariantValuesId())
                : null;

        log.info("Adding to cart: Cart ID = {}, Product Variant ID = {}, Variant Value ID = {}, Quantity = {}",
                carts.getId(),
                productVariants.getId(),
                variantValues != null ? variantValues.getId() : null,
                cartItemCreateForm.getQuantity()
        );
        log.info("Existing variant Values: {}", variantValues);

        Optional<CartItems> existingCartItem = cartItemsRepository.findByCartIdAndProductVariantIdAndVariantValueId(
                carts.getId(),
                productVariants.getId(),
                variantValues != null ? variantValues.getId() : null
        );

        log.info("Existing Cart Item: {}", existingCartItem);

        int existingQuantity = existingCartItem.map(CartItems::getQuantity).orElse(0);
        int totalRequestedQuantity = existingQuantity + cartItemCreateForm.getQuantity();

        log.info("productVariants = {},variantValues = {}", productVariants.getId(),variantValues.getId());

        int existingVariantValueQuantity = (variantValues != null)
                ? productVariantsValuesService.isVariantValueAvailable(productVariants.getId(), variantValues.getId())
                : productVariants.getStockQuantity();

        log.info("Existing Variant Value Quantity: {}", existingVariantValueQuantity);

        int availableQuantity = (variantValues != null)
                ? productVariantsValuesService.isVariantValueAvailable(
                productVariants.getId(),
                variantValues.getId()
        )
                : productVariantsValuesService.checkProductVariantAvailability(
                productVariants.getId()
        );

        log.info("availableQuantity calculated: {}", availableQuantity);

        log.info("Available Quantity: {}, Existing Quantity: {}, Requested Quantity: {}, Total Requested Quantity: {}",
                availableQuantity,
                existingQuantity,
                cartItemCreateForm.getQuantity(),
                totalRequestedQuantity
        );
        if(availableQuantity < totalRequestedQuantity || availableQuantity <= 0) {
            log.error("Sản phẩm không đủ hàng. Còn lại: {}, yêu cầu: {}",
                    availableQuantity,
                    totalRequestedQuantity);
            throw new RuntimeException(HttpStatus.BAD_REQUEST.toString() + " - Sản phẩm không đủ hàng. Còn lại: " + availableQuantity + ", yêu cầu: " + totalRequestedQuantity);
            // viet lai exception
        }

        if (existingCartItem.isPresent()) {
            CartItems existingCartItemEntity = existingCartItem.get();
            existingCartItemEntity.setQuantity(totalRequestedQuantity);
            return cartItemMapper.convertEntityToDTO(cartItemsRepository.save(existingCartItemEntity));
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
