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
import com.e_commerce.exceptions.CustomException;
import com.e_commerce.exceptions.ErrorResponse;
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
    private final AccountService accountService;

    @Override

    public CartItems getCartItemsById(Integer id) {
        return cartItemsRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorResponse.CART_ITEM_NOT_FOUND));
    }

    @Override
    public CartItemDTO addToCart(CartItemCreateForm cartItemCreateForm) {

        if(cartItemCreateForm.getQuantity() <= 0) {
            throw new CustomException(ErrorResponse.CART_ITEM_QUANTITY_INVALID);
        }

        Carts carts = cartsService.createCarts();

        ProductVariants productVariants = productVariantsService.getProductVariantEntityById(cartItemCreateForm.getProductVariantsId());

        VariantValues variantValues = cartItemCreateForm.getVariantValuesId() != null
                ? variantValuesService.getVariantValueEntityById(cartItemCreateForm.getVariantValuesId())
                : null;


        Optional<CartItems> existingCartItem = cartItemsRepository.findByCartIdAndProductVariantIdAndVariantValueId(
                carts.getId(),
                productVariants.getId(),
                variantValues != null ? variantValues.getId() : null
        );


        int existingQuantity = existingCartItem.map(CartItems::getQuantity).orElse(0);
        int totalRequestedQuantity = existingQuantity + cartItemCreateForm.getQuantity();

        int availableQuantity = (variantValues != null)
                ? productVariantsValuesService.isVariantValueAvailable(
                productVariants.getId(),
                variantValues.getId()
        )
                : productVariantsValuesService.checkProductVariantAvailability(
                productVariants.getId()
        );

        if(availableQuantity < totalRequestedQuantity || availableQuantity <= 0) {
            String stockInfo = "Available: " + availableQuantity + ", Requested: " + totalRequestedQuantity;
            throw new CustomException(List.of(ErrorResponse.CART_ITEM_QUANTITY_EXCEEDS_STOCK), stockInfo);
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
        cartItems.setSelected(false);
        cartItems.setNote(cartItemCreateForm.getNote());


        return cartItemMapper.convertEntityToDTO(cartItemsRepository.save(cartItems));
    }

    @Override
    public CartItemDTO updateCartItems(Integer id, CartItemUpdateForm cartItemUpdateForm) {
        CartItems existingCartItems = getCartItemsById(id);
        if(cartItemUpdateForm.getQuantity() != null) {
            if(cartItemUpdateForm.getQuantity() <= 0) {
                throw new CustomException(ErrorResponse.CART_ITEM_QUANTITY_INVALID);
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
    public void deleteCartItems(List<Integer> id) {
       cartItemsRepository.deleteAllByIdIn(id);
    }

    @Override
    public void deleteAllCartItemsByAccountId(Integer accountId) {
        cartItemsRepository.deleteAllByCart_Account_Id(accountId);
    }

    @Override
    public List<CartItems> getSelectedCartItemsByCartIdAndId(List<Integer> cartItemId) {
        Account account = accountService.getAccountAuth();
        Carts carts = cartsService.getCartByAccountId(account.getId());

        List<CartItems> cartItems = cartItemsRepository.findSelectedCartItemsByCartIdAndId(carts.getId(),cartItemId);

        if(cartItems.isEmpty()) {
            throw new CustomException(ErrorResponse.CART_ITEM_NOT_FOUND);
        }
        return cartItems;
    }

    @Override
    public List<CartItems> getCartItemsByCartId(Integer cartId) {
        Account account = accountService.getAccountAuth();
        Carts carts = cartsService.getCartByAccountId(account.getId());
        return cartItemsRepository.findAllSelectedByCartId(carts.getId());
    }

}
