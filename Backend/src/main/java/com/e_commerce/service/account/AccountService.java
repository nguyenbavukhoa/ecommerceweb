package com.e_commerce.service.account;

import com.e_commerce.dto.auth.accountDTO.AccountDTO;
import com.e_commerce.dto.auth.accountDTO.AuthenticationDTO;
import com.e_commerce.dto.auth.accountDTO.LoginForm;
import com.e_commerce.dto.auth.accountDTO.RegistrationForm;
import com.e_commerce.entity.account.Account;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
public interface AccountService extends UserDetailsService {
    AuthenticationDTO signIn(LoginForm loginForm);

    AccountDTO createAccount(RegistrationForm registrationForm);

    Account getAccountEntityById(int accountId);

    Account getAccountAuth();
}
