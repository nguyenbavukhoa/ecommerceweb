package com.e_commerce.service.account.impl;

import com.e_commerce.dto.auth.userInfoDTO.UserInfoCreateDTO;
import com.e_commerce.dto.auth.userInfoDTO.UserInfoDTO;
import com.e_commerce.dto.auth.userInfoDTO.UserInfoUpdateDTO;
import com.e_commerce.entity.account.Account;
import com.e_commerce.entity.account.UserInformation;
import com.e_commerce.exceptions.CustomException;
import com.e_commerce.exceptions.ErrorResponse;
import com.e_commerce.mapper.account.UserInformationMapper;
import com.e_commerce.orther.IdGenerator;
import com.e_commerce.repository.account.UserInformationRepository;
import com.e_commerce.service.account.AccountService;
import com.e_commerce.service.account.UserInformationService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
@Slf4j
public class UserInformationServiceImpl implements UserInformationService {
    private final UserInformationMapper userInformationMapper;
    private final UserInformationRepository userInformationRepository;
    private final AccountService accountService;

    @Override
    public UserInfoDTO createUserInfo(Account account, String fullName) {
        UserInformation userInformation = new UserInformation();
        userInformation.setId(IdGenerator.getGenerationId());
        userInformation.setFullName(fullName);
        userInformation.setAccount(account);
        return userInformationMapper.convertEntityToDTO(userInformationRepository.save(userInformation));
    }

    @Override
    public UserInfoDTO getUserInfoByAccountId(int accountId) {
        return null;
    }

    @Override
    public UserInfoDTO updateUserInfo(UserInfoUpdateDTO userInfoCreateDTO) {
        Account account = accountService.getAccountAuth();
        UserInformation userInformation = userInformationRepository.findByAccount_Id(account.getId())
                .orElseThrow(() -> new CustomException(ErrorResponse.USER_INFO_NOT_FOUND));

            if (userInfoCreateDTO.getFullName() != null) {
                userInformation.setFullName(userInfoCreateDTO.getFullName());
            }

            if (userInfoCreateDTO.getPhoneNumber() != null) {
                userInformation.setPhoneNumber(userInfoCreateDTO.getPhoneNumber());
            }

            if (userInfoCreateDTO.getAddress() != null) {
                userInformation.setAddress(userInfoCreateDTO.getAddress());
            }
        return userInformationMapper.convertEntityToDTO(userInformationRepository.save(userInformation));
    }

    @Override
    public UserInformation getUserInformationEntityById(int id) {
        return userInformationRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorResponse.USER_INFO_NOT_FOUND));
    }
}
