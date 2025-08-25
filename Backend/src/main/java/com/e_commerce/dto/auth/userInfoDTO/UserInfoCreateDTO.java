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
    @Email(message = "Invalid email format")
    @Size(max = 255, message = "Email cannot exceed 255 characters")
    private String email;

    @Size(max = 255, message = "Address cannot exceed 255 characters")
    private String address;

    @Size(max = 255, message = "Fullname cannot exceed 255 characters")
    private String fullname;

    private Gender gender;

    @Pattern(regexp = "^\\+?[0-9. ()-]{7,25}$", message = "Invalid phone number")
    private String phoneNumber;
}
