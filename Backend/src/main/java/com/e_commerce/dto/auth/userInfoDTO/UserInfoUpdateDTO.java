package com.e_commerce.dto.auth.userInfoDTO;

import com.e_commerce.enums.Gender;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserInfoUpdateDTO {
    private Gender gender;

    @Size(max = 255, message = "Address cannot exceed 255 characters")
    private String address;

    @Size(max = 255, message = "Fullname cannot exceed 255 characters")
    private String fullname;

    @Pattern(regexp = "^\\+?[0-9. ()-]{7,25}$", message = "Invalid phone number")
    private String phoneNumber;
}
