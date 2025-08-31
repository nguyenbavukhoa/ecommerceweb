package com.e_commerce.dto.order.cartDTO;

import com.e_commerce.dto.order.cartItemDTO.CartItemCreateForm;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartCreateForm {
    List<CartItemCreateForm> listCartItems;
}
