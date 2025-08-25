package com.e_commerce.dto.auth.accountDTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AccountUpdateDTO {
    @NotNull(message = "Account ID is required")
    private Integer id;

    @NotBlank(message = "Username must not be blank")
    @Size(min = 4, max = 50, message = "Username must be at least 4 characters long")
    private String username;

    @NotNull(message = "Status is required")
    private Boolean status;

}
