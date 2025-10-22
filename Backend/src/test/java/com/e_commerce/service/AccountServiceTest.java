package com.e_commerce.service;

import com.e_commerce.dto.auth.accountDTO.LoginForm;
import com.e_commerce.entity.account.Account;
import com.e_commerce.exceptions.CustomException;
import com.e_commerce.exceptions.ErrorResponse;
import com.e_commerce.mapper.account.AccountMapper;
import com.e_commerce.repository.account.AccountRepository;
import com.e_commerce.service.account.TokenService;
import com.e_commerce.service.account.impl.AccountServiceImpl;
import com.e_commerce.service.account.token.TokenBlacklistService;
import com.e_commerce.util.JwtUtil;
import com.e_commerce.util.LoginAttemptService;
import com.e_commerce.util.OtpUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AccountServiceTest {
    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private TokenService tokenService;

    @Mock
    private LoginAttemptService loginAttemptService;

    @Mock
    private AccountMapper accountMapper;

    @Mock
    private TokenBlacklistService tokenBlacklistService;

    @Mock
    private ApplicationEventPublisher eventPublisher;

    @Mock
    private OtpUtil otpUtil;

    @InjectMocks
    private AccountServiceImpl accountService;

    private LoginForm defaultLoginForm;
    private Account defaultAccount;

    @BeforeEach
    void setUp() {
        defaultLoginForm = new LoginForm();
        defaultLoginForm.setEmail("user@example.com");
        defaultLoginForm.setPassword("rawpass");

        defaultAccount = new Account();
        defaultAccount.setEmail("user@example.com");
        defaultAccount.setPassword("encodedPass");
        defaultAccount.setActive(true);
        defaultAccount.setStatus(true);
        // set other fields if needed
    }

    @Test
    void signIn_ShouldThrowException_WhenAccountNotFound() {
        // Arrange (chuẩn bị dữ liệu cho test)
        // Giả lập trường hợp tên người dùng không tồn tại
        when(accountRepository.findByEmail(defaultLoginForm.getEmail())).thenReturn(Optional.empty());

        // Act (Thực hi hành phương thức cần test)
        CustomException exception = assertThrows(CustomException.class,
                () -> accountService.signIn(defaultLoginForm));

        // Assert (Xác nhận kết quả)
        // Kiểm tra ngoại lệ có được ném ra hay không
        assertNotNull(exception);

        // Kiểm tra phương thức repository được gọi đúng cách hay không (verify interaction )
        verify(accountRepository).findByEmail(defaultLoginForm.getEmail());
        // Kiểm tra mã lỗi trong ngoại lệ có đúng không (verify state)
        assertTrue(exception.getErrors().contains(ErrorResponse.ACCOUNT_NOT_FOUND));


    }

    @Test
    void signIn_ShouldThrowException_WhenAccountDisabled() {
        // Arrange
        defaultAccount.setStatus(false);
        when(accountRepository.findByEmail(defaultLoginForm.getEmail()))
                .thenReturn(Optional.of(defaultAccount));

        // Act & Assert
        CustomException ex = assertThrows(CustomException.class,
                () -> accountService.signIn(defaultLoginForm));

        assertTrue(ex.getErrors().contains(ErrorResponse.ACCOUNT_DISABLED));
        verify(accountRepository).findByEmail(defaultLoginForm.getEmail());
    }

    @Test
    void signIn_ShouldThrowException_WhenAccountLocked() {
        // Arrange
        defaultAccount.setStatus(true);
        defaultAccount.setActive(false);
        when(accountRepository.findByEmail(defaultLoginForm.getEmail()))
                .thenReturn(Optional.of(defaultAccount));

        // Act & Assert
        CustomException ex = assertThrows(CustomException.class,
                () -> accountService.signIn(defaultLoginForm));

        assertTrue(ex.getErrors().contains(ErrorResponse.ACCOUNT_LOCKED));

        verify(accountRepository).findByEmail(defaultLoginForm.getEmail());
    }
}
