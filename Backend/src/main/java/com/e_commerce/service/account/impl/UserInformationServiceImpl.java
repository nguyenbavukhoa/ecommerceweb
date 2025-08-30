package com.e_commerce.service.account.impl;

import com.e_commerce.dto.auth.userInfoDTO.UserInfoCreateDTO;
import com.e_commerce.dto.auth.userInfoDTO.UserInfoDTO;
import com.e_commerce.entity.account.UserInformation;
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


    @Override
    public UserInfoDTO getUserInfoByAccountId(int accountId) {
        return null;
    }

    @Override
    public UserInfoDTO updateUserInfo(int accountId, UserInfoCreateDTO userInfoCreateDTO) {
        return null;
    }

    @Override
    public UserInformation getUserInformationEntityById(int id) {
        return userInformationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("UserInformation not found with id : " + id));
    }
}
