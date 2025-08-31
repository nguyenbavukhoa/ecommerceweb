package com.e_commerce.controller.cart;

import com.e_commerce.dto.ApiResponse;
import com.e_commerce.dto.order.cartItemDTO.CartItemCreateForm;
import com.e_commerce.dto.order.cartItemDTO.CartItemDTO;
import com.e_commerce.dto.order.cartItemDTO.CartItemUpdateForm;
import com.e_commerce.service.order.CartItemsService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart-items")
@RequiredArgsConstructor
public class CartItemController {
    private final CartItemsService cartItemsService;

    @PostMapping("/addCart")
    public ResponseEntity<ApiResponse<CartItemDTO>> addToCart(@RequestBody CartItemCreateForm cartItemCreateForm, HttpServletRequest request){
        CartItemDTO cartItemDTO = cartItemsService.addToCart(cartItemCreateForm);
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

    @DeleteMapping("/account/{accountId}")
    public ResponseEntity<ApiResponse<String>> deleteAllCartItemsByAccountId(@PathVariable Integer accountId, HttpServletRequest request) {
        cartItemsService.deleteAllCartItemsByAccountId(accountId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Clear cart items successfully", "Cart items cleared", null, request.getRequestURI()));
    }

    @DeleteMapping("/{cartId}/product/{productVariantId}")
    public ResponseEntity<ApiResponse<String>> deleteCartItem(@PathVariable Integer cartId, @PathVariable Integer productVariantId, HttpServletRequest request) {
        cartItemsService.deleteCartItems(cartId, productVariantId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Delete cart item successfully", "Cart item deleted", null, request.getRequestURI()));
    }
}
