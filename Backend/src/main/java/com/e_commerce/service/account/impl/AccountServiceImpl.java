package com.e_commerce.service.account.impl;

import com.e_commerce.dto.auth.accountDTO.AccountDTO;
import com.e_commerce.dto.auth.accountDTO.AuthenticationDTO;
import com.e_commerce.dto.auth.accountDTO.LoginForm;
import com.e_commerce.dto.auth.accountDTO.RegistrationForm;
import com.e_commerce.entity.account.Account;
import com.e_commerce.exceptions.CustomException;
import com.e_commerce.exceptions.ErrorResponse;
import com.e_commerce.mapper.account.AccountMapper;
import com.e_commerce.orther.IdGenerator;
import com.e_commerce.repository.account.AccountRepository;
import com.e_commerce.service.account.AccountService;
import com.e_commerce.util.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service
@Slf4j
public class AccountServiceImpl implements AccountService {
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    private final AccountMapper accountMapper;
    private final AccountRepository accountRepository;

    public AccountServiceImpl(@Lazy PasswordEncoder passwordEncoder, JwtUtil jwtUtil, AccountMapper accountMapper,
            AccountRepository accountRepository) {
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.accountMapper = accountMapper;
        this.accountRepository = accountRepository;
    }

    @Transactional(readOnly = true)
    @Override
    public AuthenticationDTO signIn(LoginForm loginForm) {
        Account account = accountRepository.findByEmail(loginForm.getEmail())
                .orElseThrow(() -> new CustomException(ErrorResponse.ACCOUNT_NOT_FOUND));

        if (account.isEnabled()) {
            throw new CustomException(ErrorResponse.ACCOUNT_DISABLED);
        }

        if (!account.isAccountNonLocked()) {
            throw new CustomException(ErrorResponse.ACCOUNT_LOCKED);
        }

        if (!passwordEncoder.matches(loginForm.getPassword(), account.getPassword())) {
            throw new CustomException(ErrorResponse.ACCOUNT_PASSWORD_MISMATCH);
        }

        String jwtToken = jwtUtil.generateToken(account);
        String refreshToken = jwtUtil.generateRefreshToken(account);

        return AuthenticationDTO.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .role(account.getRole().name())
                .accountName(account.getAccountName())
                .build();
    }

    @Override
    public AccountDTO createAccount(RegistrationForm registrationForm) {
        if (accountRepository.existsByEmail(registrationForm.getEmail())) {
            throw new CustomException(ErrorResponse.ACCOUNT_ALREADY_EXISTS);
        }
        // tao xac thuc email o day

        Account account = new Account();
        account.setId(IdGenerator.getGenerationId());
        account.setPassword(passwordEncoder.encode(registrationForm.getPassword()));


        return accountMapper.convertEntityToDTO(accountRepository.save(account));
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return accountRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorResponse.ACCOUNT_NOT_FOUND));
    }

    @Override
    public Account getAccountAuth() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new CustomException(ErrorResponse.UNAUTHORIZED);
        }

        return (Account) authentication.getPrincipal();
    }
//
//    @Override
//    public List<AccountDTO> getCustomerInfoList() {
//        List<Account> customers = accountRepository.findByRole(AccountRole.USER);
//        log.info("Customers: {}", customers.size());
//        if (customers.isEmpty()) {
//            throw new CustomException(ErrorResponse.ACCOUNT_NOT_FOUND);
//        }
//        return customers.stream().map(this::convertToDTO).toList();
//    }

//    private AccountDTO convertToDTO(Account account) {
//        UserInformation userInfo = account.getUserInformation();
//        String fullName = userInfo != null ? userInfo.getFullName() : null;
//        return accountMapper.convertEntityToDTO(account, fullName);
//    }
}
