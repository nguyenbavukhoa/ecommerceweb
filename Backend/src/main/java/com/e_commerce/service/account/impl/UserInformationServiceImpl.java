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

import java.util.List;
import java.util.Optional;

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
        return userInformationMapper.convertEntityToDTO(save(userInformation));
    }

    @Override
    public UserInfoDTO createUserInfo(UserInfoCreateDTO userInfoCreateDTO) {
        Account account = accountService.getAccountAuth();

        UserInformation userInformation = userInformationMapper.convertCreateDTOToEntity(userInfoCreateDTO);
        userInformation.setId(IdGenerator.getGenerationId());
        userInformation.setAccount(account);
        userInformation.setIsDefault(!validateForCheckout(account.getId()));
        return userInformationMapper.convertEntityToDTO(save(userInformation));
    }

    private UserInformation save(UserInformation userInformation) {
        return userInformationRepository.save(userInformation);
    }

    @Override
    public List<UserInfoDTO> getUserInfoByAccountId(int accountId) {
        Account account = accountService.getAccountEntityById(accountId);
        return userInformationMapper.convertEntityListToDTOList(
                userInformationRepository.findByAccount_Id(account.getId()));
    }

    @Override
    public UserInfoDTO updateUserInfo(Integer userInfoId, UserInfoUpdateDTO userInfoUpdateDTO) {
        UserInformation userInformation = getUserInformationEntityById(userInfoId);

        if (userInfoUpdateDTO.getFullName() != null) {
            userInformation.setFullName(userInfoUpdateDTO.getFullName());
        }
        if (userInfoUpdateDTO.getPhoneNumber() != null) {
            userInformation.setPhoneNumber(userInfoUpdateDTO.getPhoneNumber());
        }
        if (userInfoUpdateDTO.getAddress() != null) {
            userInformation.setAddress(userInfoUpdateDTO.getAddress());
        }
        if (userInfoUpdateDTO.getGender() != null) {
            userInformation.setGender(userInfoUpdateDTO.getGender());
        }

        return userInformationMapper.convertEntityToDTO(userInformationRepository.save(userInformation));
    }

    @Override
    public UserInformation getUserInformationEntityById(int id) {
        return userInformationRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorResponse.USER_INFO_NOT_FOUND));
    }

    @Override
    public List<UserInfoDTO> getAllUserInfoByAccount() {
        Account account = accountService.getAccountAuth();
        List<UserInformation> userInformationList = userInformationRepository
                .findByAccount_IdOrderByIsDefaultDesc(account.getId());
        return userInformationMapper.convertEntityListToDTOList(userInformationList);
    }

    private boolean validateForCheckout(Integer accountId) {
        return userInformationRepository.validateForCheckout(accountId);
    }
}
