package com.e_commerce.dto.auth.accountDTO;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class RegistrationForm {

    @NotBlank(message = "Username must not be blank")
    @Email(message = "Invalid email format")
    private String username;

    @NotBlank(message = "Password must not be blank")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;

    @NotNull(message = "Role is required")
    @Pattern(regexp = "ADMIN|USER", message = "Role must be one of: ADMIN, USER")
    private String role;
}
