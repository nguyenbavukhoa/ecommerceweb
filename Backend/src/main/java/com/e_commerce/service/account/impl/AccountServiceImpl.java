package com.e_commerce.service.account.impl;

import com.e_commerce.dto.auth.accountDTO.AccountDTO;
import com.e_commerce.dto.auth.accountDTO.AuthenticationDTO;
import com.e_commerce.dto.auth.accountDTO.LoginForm;
import com.e_commerce.entity.account.Account;
import com.e_commerce.mapper.account.AccountMapper;
import com.e_commerce.repository.account.AccountRepository;
import com.e_commerce.service.account.AccountService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AccountServiceImpl implements AccountService {
//    private final PasswordEncoder passwordEncoder;
    private final AccountMapper accountMapper;
    private final AccountRepository accountRepository;

    @Override
    public AuthenticationDTO signIn(LoginForm loginForm) {
        return null;
    }

    @Override
    public AccountDTO createAccount(AccountDTO accountDTO) {
        return null;
    }

    @Override
    public Account getAccountById(int accountId) {
        return null;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return null;
    }
}
