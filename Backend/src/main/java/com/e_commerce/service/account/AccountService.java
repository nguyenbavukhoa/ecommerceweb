package com.e_commerce.service.account;

import com.e_commerce.dto.auth.accountDTO.*;
import com.e_commerce.entity.account.Account;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public interface AccountService extends UserDetailsService {
    AuthenticationDTO signIn(LoginForm loginForm);

    AccountDTO createAccount(RegistrationForm registrationForm);

    Account getAccountAuth();

    List<AccountDTO> getCustomerInfoList();

    void logout(String token);

    List<AccountDTO> getAccountAllByRoleUser();

    Account getAccountEntityById(int id);

    AuthenticationDTO refreshToken(RefreshTokenDTO refreshTokenDTO);

    Account getAccountByEmail(String email);

    void activeAccount(String token);

    void deleteByAccountId(Integer accountId);

    ForgotPasswordResponseDTO forgotPasswordRequest(ForgotPasswordRequestDTO request);

    OtpVerificationResponseDTO verifyOtp(OtpVerificationRequestDTO request);

    void resetPassword(ResetPasswordDTO request);


}
