package com.e_commerce.dto.auth.accountDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OtpVerificationResponseDTO {
    private String message;
    private String email;
}
