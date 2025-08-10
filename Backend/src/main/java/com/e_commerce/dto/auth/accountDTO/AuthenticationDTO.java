package com.e_commerce.dto.auth.accountDTO;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationDTO {
    private String token;
    private String refreshToken;
    private String role;
}
