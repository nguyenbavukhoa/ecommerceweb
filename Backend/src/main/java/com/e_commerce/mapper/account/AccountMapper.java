package com.e_commerce.mapper.account;

import com.e_commerce.dto.auth.accountDTO.AccountDTO;
import com.e_commerce.dto.auth.accountDTO.RegistrationForm;
import com.e_commerce.entity.account.Account;
import com.e_commerce.enums.AccountRole;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

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
                .active(account.getActive().toString())
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

    public List<AccountDTO> convertListEntityToListDTO(List<Account> accounts) {
        return accounts.stream()
                .map(this::convertEntityToDTO)
                .collect(Collectors.toList());
    }
}

