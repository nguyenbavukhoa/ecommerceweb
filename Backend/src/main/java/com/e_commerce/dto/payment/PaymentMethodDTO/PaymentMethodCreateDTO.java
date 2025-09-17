package com.e_commerce.dto.payment.PaymentMethodDTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaymentMethodCreateDTO {
    @NotBlank(message = "Payment method name is required")
    @Size(max = 100, message = "Name cannot exceed 100 characters")
    private String name;

    @NotBlank(message = "Payment method code is required")
    @Size(max = 20, message = "Code cannot exceed 20 characters")
    private String code;

    @Size(max = 255, message = "Description cannot exceed 255 characters")
    private String description;

    private Boolean isActive;
}
