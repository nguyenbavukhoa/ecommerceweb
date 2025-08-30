package com.e_commerce.service.account.impl;

import com.e_commerce.dto.auth.accountDTO.AccountDTO;
import com.e_commerce.dto.auth.accountDTO.AuthenticationDTO;
import com.e_commerce.dto.auth.accountDTO.LoginForm;
import com.e_commerce.dto.auth.accountDTO.RegistrationForm;
import com.e_commerce.entity.account.Account;
import com.e_commerce.entity.account.UserInformation;
import com.e_commerce.enums.AccountRole;
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

@Service
@Slf4j
public class AccountServiceImpl implements AccountService {
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    private final AccountMapper accountMapper;
    private final AccountRepository accountRepository;
    private final UserInformationRepository userInformationRepository;


    public AccountServiceImpl(@Lazy PasswordEncoder passwordEncoder, JwtUtil jwtUtil, AccountMapper accountMapper, AccountRepository accountRepository, UserInformationRepository userInformationRepository) {
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.accountMapper = accountMapper;
        this.accountRepository = accountRepository;
        this.userInformationRepository = userInformationRepository;
    }

    @Transactional(readOnly = true)
    @Override
    public AuthenticationDTO signIn(LoginForm loginForm) {
        Account account = accountRepository.findByEmail(loginForm.getEmail())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if(account.isAccountNonLocked() && !account.isEnabled()){
            // viet code xu ly loi o day
        }

        if(account.getRole().name().equals("ADMIN")){
            // viet code xu ly loi o day
        }

        if (passwordEncoder.matches(loginForm.getPassword(), account.getPassword())) {
            // xu ly loi o day
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
            // viet code xu ly loi o day
        }
        // tao xac thuc email o day

        Account account = accountMapper.convertCreateDTOToEntity(registrationForm);
        account.setId(IdGenerator.getGenerationId());
        account.setPassword(passwordEncoder.encode(registrationForm.getPassword()));
        account.setRole(AccountRole.USER);

        account = accountRepository.save(account);
        log.info("Created new account: {}", account);

        UserInformation userInformation = new UserInformation();
        userInformation.setId(IdGenerator.getGenerationId());
        userInformation.setAccount(account);
        userInformation.setFullName(registrationForm.getFullName());
        userInformationRepository.save(userInformation);

        return accountMapper.convertEntityToDTO(account);
    }

    @Override
    public Account getAccountEntityById(int accountId) {
        return accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return accountRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Account not found with email: " + email));
    }

    @Override
    public Account getAccountAuth() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            // viet code xu ly loi o day
        }

        Account account = (Account) authentication.getPrincipal();

        log.info("User principal: {}", account);

        return account;
    }
}
