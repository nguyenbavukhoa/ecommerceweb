package com.e_commerce.service.account.impl;

import com.e_commerce.dto.auth.accountDTO.*;
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

        log.info("Create account: {}", account);

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
      @Override
    public Account getAccountEntityById(int id) {
        return accountRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorResponse.ACCOUNT_NOT_FOUND));
    }

    @Override
    public AuthenticationDTO refreshToken(RefreshTokenDTO refreshTokenDTO) {
        try {
            String refreshToken = refreshTokenDTO.getRefreshToken();

            if (jwtUtil.isTokenExpired(refreshToken, false)) {
                throw new CustomException(ErrorResponse.REFRESH_TOKEN_EXPIRED);
            }

            String email = jwtUtil.extractUsername(refreshToken, false);

            Account account = accountRepository.findByEmail(email)
                    .orElseThrow(() -> new CustomException(ErrorResponse.ACCOUNT_NOT_FOUND));

            String newAccessToken = jwtUtil.generateToken((UserDetails) account);
            String newRefreshToken = jwtUtil.generateRefreshToken((UserDetails) account);

            return AuthenticationDTO.builder()
                    .accessToken(newAccessToken)
                    .refreshToken(newRefreshToken)
                    .role(account.getRole().name())
                    .build();
        } catch (Exception e) {
            log.error("Error refreshing token: {}", e.getMessage());
            throw new CustomException(ErrorResponse.INVALID_REFRESH_TOKEN);
        }
    }

    private AccountDTO convertToDTO(Account account) {
        UserInformation userInfo = account.getUserInformation().isEmpty() ? null : account.getUserInformation().get(0);
        String fullName = userInfo != null ? userInfo.getFullName() : null;
        return accountMapper.convertEntityToDTO(account);
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

@Override
    public void logout(String token) {
        log.info("Logging out token: {}", token);
    }


    @Override
    public List<AccountDTO> getAccountAllByRoleUser() {
        List<Account> accounts = accountRepository.findByRole(AccountRole.USER);
        if (accounts.isEmpty()) {
            throw new CustomException(ErrorResponse.ACCOUNT_NOT_FOUND);
        }
        return accountMapper.convertListEntityToListDTO(accounts);
    }
    
}
