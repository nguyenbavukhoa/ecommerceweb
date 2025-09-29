package com.e_commerce.dto.auth.accountDTO;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthenticationDTO {
    private String accountName;
    private String accessToken;
    private String role;
}
