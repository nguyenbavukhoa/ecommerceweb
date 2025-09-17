package com.e_commerce.service.account;

import com.e_commerce.dto.auth.userInfoDTO.UserInfoCreateDTO;
import com.e_commerce.dto.auth.userInfoDTO.UserInfoDTO;
import com.e_commerce.dto.auth.userInfoDTO.UserInfoUpdateDTO;
import com.e_commerce.entity.account.Account;
import com.e_commerce.entity.account.UserInformation;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface UserInformationService {
    UserInfoDTO createUserInfo(Account account, String fullName);

    UserInfoDTO createUserInfo(UserInfoCreateDTO userInfoCreateDTO);

    List<UserInfoDTO> getUserInfoByAccountId(int accountId);

    UserInfoDTO updateUserInfo(Integer userInfoId, UserInfoUpdateDTO userInfoUpdateDTO);

    UserInformation getUserInformationEntityById(int id);

    List<UserInfoDTO> getAllUserInfoByAccount();


}
