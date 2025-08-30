package com.e_commerce.service.account.impl;

import com.e_commerce.dto.auth.accountDTO.AccountDTO;
import com.e_commerce.dto.auth.accountDTO.AuthenticationDTO;
import com.e_commerce.dto.auth.accountDTO.LoginForm;
import com.e_commerce.dto.auth.accountDTO.RegistrationForm;
import com.e_commerce.entity.account.Account;
import com.e_commerce.enums.AccountRole;
import com.e_commerce.mapper.account.AccountMapper;
import com.e_commerce.orther.IdGenerator;
import com.e_commerce.repository.account.AccountRepository;
import com.e_commerce.service.account.AccountService;
import com.e_commerce.service.account.UserInformationService;
import com.e_commerce.util.JwtUtil;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
public class AccountServiceImpl implements AccountService {
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    private final AccountMapper accountMapper;
    private final AccountRepository accountRepository;
    private final UserInformationService userInformationService;

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
        userInformationService.createUserInfo(account.getId(), registrationForm.getFullName());
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
}
