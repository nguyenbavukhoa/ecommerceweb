package com.e_commerce.dto.auth.userInfoDTO;

import com.e_commerce.enums.Gender;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoCreateDTO {
    @Size(max = 255, message = "Fullname cannot exceed 255 characters")
    private String fullName;
}
