package com.e_commerce.service.order.impl;

import com.e_commerce.dto.order.cartItemDTO.CartItemCreateForm;
import com.e_commerce.dto.order.cartItemDTO.CartItemDTO;
import com.e_commerce.dto.order.cartItemDTO.CartItemUpdateForm;
import com.e_commerce.entity.account.Account;
import com.e_commerce.entity.order.CartItems;
import com.e_commerce.entity.order.Carts;
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
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
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
        log.info("Adding to cart: {}", cartItemCreateForm.getQuantity());

        if(cartItemCreateForm.getQuantity() <= 0) {
            log.info("Invalid quantity: {}", cartItemCreateForm.getQuantity());
            throw new CustomException(ErrorResponse.CART_ITEM_QUANTITY_INVALID);
        }

        Carts carts = cartsService.createCarts();
        log.info("Cart ID: {}", carts.getId());

        ProductVariants productVariants = productVariantsService.getProductVariantEntityById(cartItemCreateForm.getProductVariantsId());

        List<VariantValues> variantValues = (cartItemCreateForm.getVariantValuesId() != null && !cartItemCreateForm.getVariantValuesId().isEmpty())
                ? variantValuesService.getVariantValueEntitiesById(cartItemCreateForm.getVariantValuesId())
                : List.of();


        Optional<CartItems> existingCartItem = cartItemsRepository.findByCartIdAndProductVariantIdAndVariantValues(
                carts.getId(),
                productVariants.getId(),
                cartItemCreateForm.getVariantValuesId(),
                cartItemCreateForm.getVariantValuesId() != null ? cartItemCreateForm.getVariantValuesId().size() : 0
        );

        log.info("Existing cart item: {}", existingCartItem);

        int existingQuantity = existingCartItem.map(CartItems::getQuantity).orElse(0);
        int totalRequestedQuantity = existingQuantity + cartItemCreateForm.getQuantity();

        log.info("Existing quantity: {}, New quantity: {}, Total requested quantity: {}",
                existingQuantity, cartItemCreateForm.getQuantity(), totalRequestedQuantity);

        if (variantValues.isEmpty()) {
            // Không có VariantValues → check trực tiếp stock ProductVariant
            int availableQuantity = productVariantsService.checkProductVariantAvailability(productVariants.getId());
            if (availableQuantity < totalRequestedQuantity) {
                throw new CustomException(List.of(ErrorResponse.CART_ITEM_QUANTITY_EXCEEDS_STOCK),
                        "Available: " + availableQuantity + ", Requested: " + totalRequestedQuantity);
            }
        }else {
            // Có nhiều VariantValues → check từng cái
            for (VariantValues value : variantValues) {
                int availableQuantity = productVariantsValuesService.isVariantValueAvailable(
                        productVariants.getId(),
                        value.getId()
                );
                if (availableQuantity < totalRequestedQuantity) {
                    throw new CustomException(List.of(ErrorResponse.CART_ITEM_QUANTITY_EXCEEDS_STOCK),
                            "VariantValue " + value.getValue() +
                                    " available: " + availableQuantity +
                                    ", requested: " + totalRequestedQuantity);
                }
            }
        }
//        int availableQuantity = (variantValues != null)
//                ? productVariantsValuesService.isVariantValueAvailable(
//                productVariants.getId(),
//                variantValues.getId()
//        )
//                : productVariantsService.checkProductVariantAvailability(
//                productVariants.getId()
//        );

//        log.info("Available quantity: {}, Total requested quantity: {}", availableQuantity, totalRequestedQuantity);
//
//        if(availableQuantity < totalRequestedQuantity || availableQuantity <= 0) {
//            String stockInfo = "Available: " + availableQuantity + ", Requested: " + totalRequestedQuantity;
//            throw new CustomException(List.of(ErrorResponse.CART_ITEM_QUANTITY_EXCEEDS_STOCK), stockInfo);
//        }

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

        BigDecimal totalPrice = productVariants.getPrice();

        if (!variantValues.isEmpty()) {
            BigDecimal extraPrice = variantValues.stream()
                    .map(VariantValues::getPrice)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            totalPrice = totalPrice.add(extraPrice);
        }

        cartItems.setPrice(totalPrice);

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
    public List<CartItemDTO> getAll() {
        Account account = accountService.getAccountAuth();
        return cartItemMapper.convertPageToList(cartItemsRepository.findByCart_Account_Id(account.getId()));
    }

    @Transactional
    @Override
    public void deleteCartItems(List<Integer> id) {
       cartItemsRepository.deleteAllByIdIn(id);
    }

    @Transactional
    @Override
    public void deleteAllCartItemsByAccountId() {
        Account account = accountService.getAccountAuth();
        cartItemsRepository.deleteAllByCart_Account_Id(account.getId());
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
        return cartItemsRepository.findAllSelectedByCartId(cartId);
    }

    @Override
    public CartItemDTO changeSelectedCartItem(Integer id, boolean selected) {
        CartItems cartItems = getCartItemsById(id);
        cartItems.setSelected(selected);
        return cartItemMapper.convertEntityToDTO(cartItemsRepository.save(cartItems));
    }

    @Override
    public List<CartItemDTO> getCartItemsAllSelected() {
        Account account = accountService.getAccountAuth();
        Carts carts = cartsService.getCartByAccountId(account.getId());
        return cartItemMapper.convertPageToList(cartItemsRepository.findAllSelectedByCartId(carts.getId()));
    }

}
