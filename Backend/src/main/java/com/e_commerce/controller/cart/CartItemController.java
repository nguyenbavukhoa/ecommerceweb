package com.e_commerce.controller.cart;

import com.e_commerce.dto.ApiResponse;
import com.e_commerce.dto.order.cartItemDTO.CartItemCreateForm;
import com.e_commerce.dto.order.cartItemDTO.CartItemDTO;
import com.e_commerce.dto.order.cartItemDTO.CartItemUpdateForm;
import com.e_commerce.service.order.CartItemsService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart-items")
@RequiredArgsConstructor
@Slf4j
public class CartItemController {
    private final CartItemsService cartItemsService;

    @PostMapping("/addCart")
    public ResponseEntity<ApiResponse<CartItemDTO>> addToCart(@Valid @RequestBody CartItemCreateForm cartItemCreateForm, HttpServletRequest request){
        log.info("Received add to cart request: {}", cartItemCreateForm);
        CartItemDTO cartItemDTO = cartItemsService.addToCart(cartItemCreateForm);
        log.info("CartItemDTO: {}", cartItemDTO);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true,"Add to cart successfully" ,cartItemDTO ,null ,request.getRequestURI()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CartItemDTO>> updateCartItem( @PathVariable Integer id,@RequestBody CartItemUpdateForm cartItemUpdateForm,HttpServletRequest request) {
        CartItemDTO cartItemDTO = cartItemsService.updateCartItems(id, cartItemUpdateForm);
        return ResponseEntity.ok(new ApiResponse<>(true,  "Update cart item successfully", cartItemDTO, null, request.getRequestURI()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<List<CartItemDTO>>> getCartItemById(@PathVariable Integer id, HttpServletRequest request) {
        List<CartItemDTO> cartItemDTO = cartItemsService.getCartItemsByAccountId(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Get cart item successfully", cartItemDTO, null, request.getRequestURI()));
    }

    @DeleteMapping("/account")
    public ResponseEntity<ApiResponse<String>> deleteAllCartItemsByAccountId( HttpServletRequest request) {
        cartItemsService.deleteAllCartItemsByAccountId();
        return ResponseEntity.ok(new ApiResponse<>(true, "Clear cart items successfully", "Cart items cleared", null, request.getRequestURI()));
    }

    @DeleteMapping("/{cartId}")
    public ResponseEntity<ApiResponse<String>> deleteCartItem(@PathVariable List<Integer> cartId, HttpServletRequest request) {
        cartItemsService.deleteCartItems(cartId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Delete cart item successfully", "Cart item deleted", null, request.getRequestURI()));
    }

    @PutMapping("/select/{id}")
    public ResponseEntity<ApiResponse<CartItemDTO>> changeSelectedCartItem(@PathVariable Integer id, @RequestParam boolean selected, HttpServletRequest request) {
        CartItemDTO cartItemDTO = cartItemsService.changeSelectedCartItem(id, selected);
        return ResponseEntity.ok(new ApiResponse<>(true, "Change selected cart item successfully", cartItemDTO, null, request.getRequestURI()));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CartItemDTO>>> getCartItems(
            @RequestParam(value = "selected", required = false) Boolean selected,
            HttpServletRequest request) {

        List<CartItemDTO> cartItemDTO;

        if (Boolean.TRUE.equals(selected)) {
            cartItemDTO = cartItemsService.getCartItemsAllSelected();
        } else {
            cartItemDTO = cartItemsService.getAll();
        }

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Get cart items successfully", cartItemDTO, null, request.getRequestURI())
        );
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<CartItemDTO>>> getAllCartItems(HttpServletRequest request) {
        List<CartItemDTO> cartItemDTO = cartItemsService.getAll();
        return ResponseEntity.ok(new ApiResponse<>(true, "Get all cart items successfully", cartItemDTO, null, request.getRequestURI()));
    }

    @PutMapping("/{id}/quantity")
    public ResponseEntity<ApiResponse<CartItemDTO>> updateCartItemQuantity(@PathVariable Integer id, @RequestParam int quantity, HttpServletRequest request) {
        CartItemDTO cartItemDTO = cartItemsService.updateCartItemQuantity(id, quantity);
        return ResponseEntity.ok(new ApiResponse<>(true, "Update cart item quantity successfully", cartItemDTO, null, request.getRequestURI()));
    }

}
