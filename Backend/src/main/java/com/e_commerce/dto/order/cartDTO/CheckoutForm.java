package com.e_commerce.dto.order.cartDTO;

import com.e_commerce.dto.auth.userInfoDTO.UserInfoUpdateDTO;
import com.e_commerce.dto.order.orderDTO.OrderCreateForm;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
public class CheckoutForm {
    @Valid
    @NotNull(message = "Order form cannot be null")
    private OrderCreateForm orderForm;

    @Valid
    @NotNull(message = "User info id cannot be null")
    private Integer userInfoId;
}
