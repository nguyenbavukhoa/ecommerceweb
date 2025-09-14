package com.e_commerce.mapper.account;

import com.e_commerce.dto.auth.accountDTO.AccountDTO;
import com.e_commerce.dto.auth.accountDTO.RegistrationForm;
import com.e_commerce.entity.account.Account;
import com.e_commerce.enums.AccountRole;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class AccountMapper {
    private final UserInformationMapper userInformationMapper;

    public AccountDTO convertEntityToDTO(Account account) {
        return AccountDTO.builder()
                .id(account.getId())
                .email(account.getUsername())
                .accountName(account.getAccountName())
                .createAt(account.getCreatedAt())
                .status(account.getStatus())
                .role(account.getRole().name())
                .build();
    }

    public Account convertCreateDTOToEntity(RegistrationForm registrationForm) {
        return Account.builder()
                .email(registrationForm.getEmail())
                .accountName(registrationForm.getAccountName())
                .role((AccountRole.valueOf(registrationForm.getRole())))
                .status(false)
                .active(true)
                .build();
    }
}
