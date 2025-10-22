package com.e_commerce.mapper.account;

import com.e_commerce.dto.auth.userInfoDTO.UserInfoCreateDTO;
import com.e_commerce.dto.auth.userInfoDTO.UserInfoDTO;
import com.e_commerce.dto.auth.userInfoDTO.UserInfoUpdateDTO;
import com.e_commerce.entity.account.UserInformation;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class UserInformationMapper {
    public UserInfoDTO convertEntityToDTO(UserInformation userInformation) {
        return UserInfoDTO.builder()
                .id(userInformation.getId())
                .fullName(userInformation.getFullName())
                .address(userInformation.getAddress())
                .phoneNumber(userInformation.getPhoneNumber())
                .gender(userInformation.getGender())
                .build();
    }

    public UserInformation convertCreateDTOToEntity(UserInfoCreateDTO userInfoCreateDTO) {
        return UserInformation.builder()
                .fullName(userInfoCreateDTO.getFullName())
                .address(userInfoCreateDTO.getAddress())
                .phoneNumber(userInfoCreateDTO.getPhoneNumber())
                .gender(userInfoCreateDTO.getGender() != null ? userInfoCreateDTO.getGender() : null)
                .build();
    }

    public UserInformation convertUpdateDTOToEntity(UserInfoUpdateDTO userInfoUpdateDTO) {
        return UserInformation.builder()
                .fullName(userInfoUpdateDTO.getFullName())
                .address(userInfoUpdateDTO.getAddress())
                .phoneNumber(userInfoUpdateDTO.getPhoneNumber())
                .gender(userInfoUpdateDTO.getGender())
                .build();
    }

    public List<UserInfoDTO> convertEntityListToDTOList(List<UserInformation> userInformationList) {
        return userInformationList.stream()
                .map(this::convertEntityToDTO)
                .collect(Collectors.toList());
    }


}
