package com.e_commerce.service.order.impl;

import com.e_commerce.dto.order.cartItemDTO.CartItemCreateForm;
import com.e_commerce.dto.order.cartItemDTO.CartItemDTO;
import com.e_commerce.dto.order.cartItemDTO.CartItemUpdateForm;
import com.e_commerce.entity.account.Account;
import com.e_commerce.entity.order.CartItems;
import com.e_commerce.entity.order.Carts;
import com.e_commerce.entity.product.OptionValues;
import com.e_commerce.entity.product.Product;
import com.e_commerce.exceptions.CustomException;
import com.e_commerce.exceptions.ErrorResponse;
import com.e_commerce.mapper.order.CartItemMapper;
import com.e_commerce.orther.IdGenerator;
import com.e_commerce.repository.order.CartItemsRepository;
import com.e_commerce.service.account.AccountService;
import com.e_commerce.service.order.CartItemsService;
import com.e_commerce.service.order.CartsService;
import com.e_commerce.service.product.OptionsValuesService;
import com.e_commerce.service.product.ProductService;
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
    private final ProductService productService;
    private final OptionsValuesService optionsValuesService;
    private final AccountService accountService;

    @Override

    public CartItems getCartItemsById(Integer id) {
        return cartItemsRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorResponse.CART_ITEM_NOT_FOUND));
    }

    @Override
    public CartItemDTO addToCart(CartItemCreateForm cartItemCreateForm) {
//        log.info("Adding to cart: {}", cartItemCreateForm.getQuantity());

        Integer quantity = cartItemCreateForm.getQuantity();
        if (quantity == null || quantity <= 0) {
            quantity = 1; // mặc định 1
        }

        Product product = productService.getProductEntityById(cartItemCreateForm.getProductId());

        Carts carts = cartsService.createCarts();
//        log.info("Cart ID: {}", carts.getId());


        List<OptionValues> selectedOptions = (cartItemCreateForm.getOptionValueId() != null && !cartItemCreateForm.getOptionValueId().isEmpty())
                ? optionsValuesService.getVariantValueEntitiesById(cartItemCreateForm.getOptionValueId())
                : List.of();


        Optional<CartItems> existingCartItem = cartItemsRepository.findByCartIdAndProductIdAndOptionValues(
                carts.getId(),
                product.getId(),
                cartItemCreateForm.getOptionValueId(),
                cartItemCreateForm.getOptionValueId() != null ? cartItemCreateForm.getOptionValueId().size() : 0
        );

//        log.info("Existing cart item: {}", existingCartItem);

        int existingQuantity = existingCartItem.map(CartItems::getQuantity).orElse(0);
        int totalRequestedQuantity = existingQuantity + quantity;

//        log.info("Existing quantity: {}, New quantity: {}, Total requested quantity: {}",
//                existingQuantity, cartItemCreateForm.getQuantity(), totalRequestedQuantity);

        if (selectedOptions.isEmpty()) {
            if (product.getQuantity() < totalRequestedQuantity) {
                throw new CustomException(List.of(ErrorResponse.CART_ITEM_QUANTITY_EXCEEDS_STOCK),
                        "Available: " + product.getQuantity() + ", Requested: " + totalRequestedQuantity);
            }
        }else {
            // Có nhiều VariantValues → check từng cái
            for (OptionValues value : selectedOptions) {
                if (value.getStockQuantity() < totalRequestedQuantity) {
                    throw new CustomException(List.of(ErrorResponse.CART_ITEM_QUANTITY_EXCEEDS_STOCK),
                            "Option '" + value.getName() + "' available: " + value.getStockQuantity() +
                                    ", requested: " + totalRequestedQuantity);
                }
            }
        }

        if (existingCartItem.isPresent()) {
            CartItems existingCartItemEntity = existingCartItem.get();
            existingCartItemEntity.setQuantity(totalRequestedQuantity);
            return cartItemMapper.convertEntityToDTO(cartItemsRepository.save(existingCartItemEntity));
        }

        CartItems cartItems = cartItemMapper.convertCreateDTOToEntity(cartItemCreateForm);
        cartItems.setId(IdGenerator.getGenerationId());
        cartItems.setCart(carts);
        cartItems.setProduct(product);
        cartItems.setQuantity(quantity);

        cartItems.setSelected(false);
        cartItems.setNote(cartItemCreateForm.getNote());
        cartItems.setSelectedOptions(selectedOptions);

        BigDecimal totalPrice = product.getPriceBase();

        if (!selectedOptions.isEmpty()) {
            BigDecimal extraPrice = selectedOptions.stream()
                    .map(OptionValues::getAdditionalPrice)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            totalPrice = totalPrice.add(extraPrice);
        }

        cartItems.setPrice(totalPrice);

//        log.info("Added to cart: {}", cartItems);

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

    @Transactional
    @Override
    public CartItemDTO updateCartItemQuantity(Integer id, int newQuantity) {
        if(newQuantity <= 0) {
            throw new CustomException(ErrorResponse.CART_ITEM_QUANTITY_INVALID);
        }

        CartItems cartItems = getCartItemsById(id);

        Product product = cartItems.getProduct();

        List<OptionValues> selectedOptions = cartItems.getSelectedOptions();

        validateStock(product, selectedOptions, newQuantity);

        cartItems.setQuantity(newQuantity);

        return cartItemMapper.convertEntityToDTO(cartItemsRepository.save(cartItems));
    }

    private void validateStock(Product product, List<OptionValues> selectedOptions, int totalRequestedQuantity) {
        if (selectedOptions == null || selectedOptions.isEmpty()) {
            if (product.getQuantity() < totalRequestedQuantity) {
                throw new CustomException(
                        List.of(ErrorResponse.CART_ITEM_QUANTITY_EXCEEDS_STOCK),
                        "Available: " + product.getQuantity() + ", Requested: " + totalRequestedQuantity
                );
            }
        } else {
            for (OptionValues value : selectedOptions) {
                if (value.getStockQuantity() < totalRequestedQuantity) {
                    throw new CustomException(
                            List.of(ErrorResponse.CART_ITEM_QUANTITY_EXCEEDS_STOCK),
                            "Option '" + value.getName() + "' available: " + value.getStockQuantity() +
                                    ", requested: " + totalRequestedQuantity
                    );
                }
            }
        }
    }
}
