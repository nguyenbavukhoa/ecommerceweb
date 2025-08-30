package com.e_commerce.service.account;

import com.e_commerce.dto.auth.userInfoDTO.UserInfoCreateDTO;
import com.e_commerce.dto.auth.userInfoDTO.UserInfoDTO;
import com.e_commerce.entity.account.Account;
import com.e_commerce.entity.account.UserInformation;
import org.springframework.stereotype.Service;

@Service
public interface UserInformationService {
    UserInfoDTO createUserInfo(Account account, String fullName);

    UserInfoDTO getUserInfoByAccountId(int accountId);

    UserInfoDTO updateUserInfo(int accountId, UserInfoCreateDTO userInfoCreateDTO);

    UserInformation getUserInformationEntityById(int id);
}
