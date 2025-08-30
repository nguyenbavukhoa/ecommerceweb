package com.e_commerce.mapper.account;

import com.e_commerce.dto.auth.accountDTO.AccountDTO;
import com.e_commerce.dto.auth.accountDTO.RegistrationForm;
import com.e_commerce.entity.account.Account;
import com.e_commerce.enums.AccountRole;
import org.springframework.stereotype.Component;

@Component
public class AccountMapper {
    public AccountDTO convertEntityToDTO(Account account) {
        return AccountDTO.builder()
                .id(account.getId())
                .email(account.getUsername())
                .displayName(account.getDisplayName())
                .createAt(account.getCreatedAt())
                .status(account.getStatus())
                .role(account.getRole().name())
                .build();
    }

    public Account convertCreateDTOToEntity(RegistrationForm registrationForm) {
        return Account.builder()
                .email(registrationForm.getEmail())
                .role((AccountRole.valueOf(registrationForm.getRole())))
                .displayName(registrationForm.getDisplayName())
                .status(false)
                .active(true)
                .build();
    }
}
