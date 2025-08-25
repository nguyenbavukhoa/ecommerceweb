package com.e_commerce.dto.auth.userInfoDTO;

import com.e_commerce.enums.Gender;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserInfoDTO {
    private String fullName;

    private String address;

    private String phoneNumber;

    private Gender gender;
}
