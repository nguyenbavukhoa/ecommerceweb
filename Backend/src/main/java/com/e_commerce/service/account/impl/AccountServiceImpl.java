package com.e_commerce.service.account.impl;

import com.e_commerce.dto.auth.accountDTO.AccountDTO;
import com.e_commerce.dto.auth.accountDTO.AuthenticationDTO;
import com.e_commerce.dto.auth.accountDTO.LoginForm;
import com.e_commerce.dto.auth.accountDTO.RegistrationForm;
import com.e_commerce.entity.account.Account;
import com.e_commerce.entity.account.UserInformation;
import com.e_commerce.enums.AccountRole;
import com.e_commerce.exceptions.CustomException;
import com.e_commerce.exceptions.ErrorResponse;
import com.e_commerce.mapper.account.AccountMapper;
import com.e_commerce.orther.IdGenerator;
import com.e_commerce.repository.account.AccountRepository;
import com.e_commerce.repository.account.UserInformationRepository;
import com.e_commerce.service.account.AccountService;
import com.e_commerce.service.account.UserInformationService;
import com.e_commerce.util.JwtUtil;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import com.e_commerce.enums.AccountRole;
import com.e_commerce.service.account.token.TokenBlacklistService;

@Service
@Slf4j
public class AccountServiceImpl implements AccountService {
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    private final AccountMapper accountMapper;
    private final AccountRepository accountRepository;
    private final UserInformationService userInformationService;
    private final TokenBlacklistService tokenBlacklistService;

    public AccountServiceImpl(@Lazy PasswordEncoder passwordEncoder, JwtUtil jwtUtil, AccountMapper accountMapper,
            AccountRepository accountRepository, UserInformationService userInformationService, 
            TokenBlacklistService tokenBlacklistService) {
        this.tokenBlacklistService = tokenBlacklistService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.accountMapper = accountMapper;
        this.accountRepository = accountRepository;
        this.userInformationService = userInformationService;
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
                .build();
    }

    @Override
    public AccountDTO createAccount(RegistrationForm registrationForm) {
        if (accountRepository.existsByEmail(registrationForm.getEmail())) {
            throw new CustomException(ErrorResponse.ACCOUNT_ALREADY_EXISTS);
        }
        // tao xac thuc email o day

        Account account = accountMapper.convertCreateDTOToEntity(registrationForm);
        account.setId(IdGenerator.getGenerationId());
        account.setPassword(passwordEncoder.encode(registrationForm.getPassword()));
        account.setRole(AccountRole.USER);

        account = accountRepository.save(account);

        userInformationService.createUserInfo(account, registrationForm.getFullName());

        return accountMapper.convertEntityToDTO(account, registrationForm.getFullName());
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

    @Override
    public List<AccountDTO> getCustomerInfoList() {
        List<Account> customers = accountRepository.findByRole(AccountRole.USER);
        log.info("Customers: {}", customers.size());
        if (customers.isEmpty()) {
            throw new CustomException(ErrorResponse.ACCOUNT_NOT_FOUND);
        }
        return customers.stream().map(this::convertToDTO).toList();
    }

    private AccountDTO convertToDTO(Account account) {
        UserInformation userInfo = account.getUserInformation();
        String fullName = userInfo != null ? userInfo.getFullName() : null;
        return accountMapper.convertEntityToDTO(account, fullName);
    }

    @Override
    public void logout(String token) {
        tokenBlacklistService.addToBlacklist(token);
        log.info("Logging out token: {}", token);
    }
}
