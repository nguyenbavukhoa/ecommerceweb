package com.e_commerce.service.account.impl;

import com.e_commerce.dto.auth.accountDTO.*;
import com.e_commerce.entity.account.Account;
import com.e_commerce.entity.account.Token;
import com.e_commerce.entity.account.UserInformation;
import com.e_commerce.enums.AccountRole;
import com.e_commerce.enums.TokenType;
import com.e_commerce.event.ForgotPasswordEvent;
import com.e_commerce.event.RegistrationCompleteEvent;
import com.e_commerce.exceptions.CustomException;
import com.e_commerce.exceptions.ErrorResponse;
import com.e_commerce.mapper.account.AccountMapper;
import com.e_commerce.orther.IdGenerator;
import com.e_commerce.repository.account.AccountRepository;
import com.e_commerce.service.account.AccountService;
import com.e_commerce.service.account.TokenService;
import com.e_commerce.util.JwtUtil;

import com.e_commerce.util.LoginAttemptService;
import com.e_commerce.util.OtpUtil;
import com.e_commerce.util.RedisKeyUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import com.e_commerce.service.account.token.TokenBlacklistService;


@Service
@Slf4j
public class AccountServiceImpl implements AccountService {
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    private final AccountMapper accountMapper;
    private final AccountRepository accountRepository;
    private final TokenBlacklistService tokenBlacklistService;
    private final TokenService tokenService;
    private final ApplicationEventPublisher eventPublisher;
    private final OtpUtil otpUtil;
    private final LoginAttemptService loginAttemptService;

    public AccountServiceImpl(@Lazy PasswordEncoder passwordEncoder, JwtUtil jwtUtil, AccountMapper accountMapper,
                              AccountRepository accountRepository, TokenBlacklistService tokenBlacklistService, TokenService tokenService, ApplicationEventPublisher eventPublisher, OtpUtil otpUtil, LoginAttemptService loginAttemptService) {
        this.loginAttemptService = loginAttemptService;
        this.otpUtil = otpUtil;
        this.eventPublisher = eventPublisher;
        this.tokenService = tokenService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.accountMapper = accountMapper;
        this.accountRepository = accountRepository;
        this.tokenBlacklistService = tokenBlacklistService;
    }

    @Transactional(noRollbackFor = CustomException.class)
    @Override
    public AuthenticationDTO signIn(LoginForm loginForm) {
        Account account = accountRepository.findByEmail(loginForm.getEmail())
                .orElseThrow(() -> new CustomException(ErrorResponse.ACCOUNT_NOT_FOUND));

        if (!account.isEnabled()) {
            throw new CustomException(ErrorResponse.ACCOUNT_DISABLED);
        }


        if (!account.isAccountNonLocked()) {
            throw new CustomException(ErrorResponse.ACCOUNT_LOCKED);
        }


        if (!passwordEncoder.matches(loginForm.getPassword(), account.getPassword())) {
            loginAttemptService.loginFailed(loginForm.getEmail());
            int remaining = loginAttemptService.getRemainingAttempts(loginForm.getEmail());


            if (remaining <= 0) {
                loginAttemptService.lockTemporarily(loginForm.getEmail());

                long fraudCount = loginAttemptService.incrementFraud(loginForm.getEmail());

                if (fraudCount >= 3) {
                    account.setActive(false);
                    accountRepository.save(account);

                    loginAttemptService.clearLoginState(loginForm.getEmail());

                    throw new CustomException(List.of(ErrorResponse.FRAUDULENT_LOGIN_DETECTED),
                            "Phát hiện nhiều lần đăng nhập thất bại. Tài khoản đã bị khóa vĩnh viễn. Vui lòng liên hệ hỗ trợ.");
                }

                long lockTimeRemaining = loginAttemptService.getLockTimeRemaining(loginForm.getEmail());
                throw new CustomException(List.of(ErrorResponse.ACCOUNT_MAX_LOGIN_ATTEMPTS_EXCEEDED),
                        "Tài khoản bị khóa trong " + lockTimeRemaining + " phút.");
            }
            String message = "Invalid credentials. You have " + remaining + " attempt(s) left.";
            throw new CustomException(List.of(ErrorResponse.ACCOUNT_PASSWORD_MISMATCH),message);
        }

        if (loginAttemptService.isBlocked(loginForm.getEmail())) {
            long lockTimeRemaining = loginAttemptService.getLockTimeRemaining(loginForm.getEmail());
            String message = "Your account is locked due to multiple failed login attempts. Please try again in " + lockTimeRemaining + " minute(s).";
            throw new CustomException(List.of(ErrorResponse.ACCOUNT_MAX_LOGIN_ATTEMPTS_EXCEEDED), message);
        }


        loginAttemptService.loginSucceeded(loginForm.getEmail());
        String jwtToken = jwtUtil.generateToken(account);
        String refreshToken = jwtUtil.generateRefreshToken(account);

        // Lưu refresh token vào database
        tokenService.generateRefreshToken(account, refreshToken);

        return AuthenticationDTO.builder()
                .accessToken(jwtToken)
                .accountName(account.getAccountName())
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

        Account savedAccount = accountRepository.save(account);

        tokenService.generateToken(account); // Tạo và lưu token xác thực email

        eventPublisher.publishEvent(new RegistrationCompleteEvent(this, registrationForm.getEmail()));

        return accountMapper.convertEntityToDTO(savedAccount);
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

            Token storedRefreshToken = tokenService.getTokenByAccountIdAndTokenType(account.getId(), TokenType.REFRESH_TOKEN.name());

            if (storedRefreshToken == null || !storedRefreshToken.getToken().equals(refreshToken)) {
                throw new CustomException(ErrorResponse.INVALID_REFRESH_TOKEN);
            }

            tokenService.deleteToken(refreshToken, TokenType.REFRESH_TOKEN.name());

            String newAccessToken = jwtUtil.generateToken((UserDetails) account);
            String newRefreshToken = jwtUtil.generateRefreshToken((UserDetails) account);
            tokenService.generateRefreshToken(account, newRefreshToken);

            return AuthenticationDTO.builder()
                    .accessToken(newAccessToken)
                    .role(account.getRole().name())
                    .build();
        } catch (Exception e) {
            log.error("Error refreshing token: {}", e.getMessage());
            throw new CustomException(ErrorResponse.INVALID_REFRESH_TOKEN);
        }
    }

    @Override
    public Account getAccountByEmail(String email) {
        return accountRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorResponse.ACCOUNT_NOT_FOUND));
    }

    @Override
    @Transactional
    public void activeAccount(String token) {
        Token registrationToken = tokenService.getTokenByTokenAndTokenType(token, TokenType.EMAIL_VERIFICATION.name())
                .orElseThrow(() -> new CustomException(ErrorResponse.TOKEN_NOT_FOUND));

        if (registrationToken == null) {
            throw new CustomException(ErrorResponse.TOKEN_NOT_FOUND);
        }

        if (registrationToken.getExpirationTime().isAfter(LocalDateTime.now())) {
            Account account = registrationToken.getAccount();
            account.setStatus(true);
            accountRepository.save(account);
            tokenService.deleteToken(token, TokenType.EMAIL_VERIFICATION.name());
            log.info("Account with email {} has been activated.", account.getEmail());
        } else{
            tokenService.deleteToken(token, TokenType.EMAIL_VERIFICATION.name());
            deleteByAccountId(registrationToken.getAccount().getId());
            throw new CustomException(ErrorResponse.TOKEN_EXPIRED);
        }
    }

    @Override
    public void deleteByAccountId(Integer accountId) {
        if (!accountRepository.existsById(accountId)) {
            throw new CustomException(ErrorResponse.ACCOUNT_NOT_FOUND);
        }
        accountRepository.deleteById(accountId);
    }

    @Override
    public ForgotPasswordResponseDTO forgotPasswordRequest(ForgotPasswordRequestDTO request) {
        Account account = getAccountByEmail(request.getEmail());


        if (otpUtil.isOtpExists(account.getEmail())) {
            Duration ttl  = otpUtil.getOtpTtl(account.getEmail());
            long remainingMinutes = (ttl != null) ? ttl.toMinutes() : 0;
            return ForgotPasswordResponseDTO.builder()
                    .message(String.valueOf(ErrorResponse.OTP_ALREADY_SENT))
                    .expiresIn((int)remainingMinutes)
                    .build();
        }

        String otp = otpUtil.generateOtp(account.getEmail());
        // Gửi email chứa OTP
        eventPublisher.publishEvent(new ForgotPasswordEvent(this, account.getEmail(), otp));

        Duration ttl  = otpUtil.getOtpTtl(account.getEmail());
        long remainingMinutes = (ttl != null) ? ttl.toMinutes() : 0;
        log.info("Sending OTP {} to email {}", otp, account.getEmail());
        return ForgotPasswordResponseDTO.builder()
                .message("OTP has been sent to your email.")
                .expiresIn((int)remainingMinutes)
                .build();
    }

    @Override
    public OtpVerificationResponseDTO verifyOtp(OtpVerificationRequestDTO request) {
        Account account = getAccountByEmail(request.getEmail());

        if (!otpUtil.validateOtp(account.getEmail(), request.getOtp())) {
            int remainingAttempts = otpUtil.getRemainingAttempts(account.getEmail());
            if (remainingAttempts <= 0) {
                otpUtil.clearOtp(account.getEmail());
                throw new CustomException(ErrorResponse.OTP_MAX_ATTEMPTS_EXCEEDED);
            }
            throw new CustomException(ErrorResponse.OTP_EXPIRED_OR_INVALID);
        }

        return OtpVerificationResponseDTO.builder()
                .message("OTP is valid.")
                .email(account.getEmail())
                .build();
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordDTO request) {
        Account account = getAccountByEmail(request.getEmail());

        if(!otpUtil.isOtpVerified(request.getEmail())) {
            throw new CustomException(ErrorResponse.OTP_REQUIRED);
        }

        account.setPassword(passwordEncoder.encode(request.getNewPassword()));
        accountRepository.save(account);
        otpUtil.clearOtp(account.getEmail());
    }

    private AccountDTO convertToDTO(Account account) {
        UserInformation userInfo = account.getUserInformation().isEmpty() ? null : account.getUserInformation().get(0);
        String fullName = userInfo != null ? userInfo.getFullName() : null;
        return accountMapper.convertEntityToDTO(account);
    }

    @Override
    public List<AccountDTO> getCustomerInfoList() {
        List<Account> customers = accountRepository.findByRole(AccountRole.USER);
        if (customers.isEmpty()) {
            throw new CustomException(ErrorResponse.ACCOUNT_NOT_FOUND);
        }
        return customers.stream().map(this::convertToDTO).toList();
    }

@Override
    public void logout(String token) {
        log.info("Logging out token: {}", token);
        tokenBlacklistService.addToBlacklist(token);
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
