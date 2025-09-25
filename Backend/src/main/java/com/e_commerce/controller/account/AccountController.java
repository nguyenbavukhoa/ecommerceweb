package com.e_commerce.controller.account;

import com.e_commerce.dto.ApiResponse;
import com.e_commerce.dto.auth.accountDTO.*;
import com.e_commerce.service.account.AccountService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor

@Slf4j
public class AccountController {
    private final AccountService accountService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthenticationDTO>> login(@Valid @RequestBody LoginForm loginForm,
            HttpServletRequest request) {
        AuthenticationDTO login = accountService.signIn(loginForm);
        return ResponseEntity.ok(new ApiResponse<>(true, "Login successfully", login, null, request.getRequestURI()));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AccountDTO>> register(@Valid @RequestBody RegistrationForm registrationForm,
            HttpServletRequest request) {
        AccountDTO register = accountService.createAccount(registrationForm);
        return ResponseEntity
                .ok(new ApiResponse<>(true, "Register successfully", register, null, request.getRequestURI()));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(@RequestHeader("Authorization") String token,
            HttpServletRequest request) {
        String jwt = token.startsWith("Bearer ") ? token.substring(7) : token;
        accountService.logout(jwt);
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Logged out successfully",
                null,
                null,
                request.getRequestURI()));
    }

     @GetMapping("/all-user")
    public ResponseEntity<ApiResponse<List<AccountDTO>>> getAllUser(HttpServletRequest request) {
        List<AccountDTO> accountDTOList = accountService.getAccountAllByRoleUser();
        return ResponseEntity.ok(new ApiResponse<>(true, "Get all user successfully", accountDTOList, null, request.getRequestURI()));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AccountDTO>>> getCustomers(HttpServletRequest request) {
        List<AccountDTO> customerInfo = accountService.getCustomerInfoList();
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Get customer info successfully", customerInfo, null, request.getRequestURI()));

    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<AuthenticationDTO>> refreshToken(@RequestBody @Valid RefreshTokenDTO refreshTokenDTO,
            HttpServletRequest request) {
        AuthenticationDTO authenticationDTO = accountService.refreshToken(refreshTokenDTO);
        return ResponseEntity.ok(new ApiResponse<>(true, "Token refreshed successfully", authenticationDTO, null, request.getRequestURI()));
    }

    @GetMapping("/activate")
    public ResponseEntity<ApiResponse<Void>> activateAccount(@RequestParam("token") String token, HttpServletRequest request) {
        accountService.activeAccount(token);

        return ResponseEntity.ok(new ApiResponse<>(true, "Account activated successfully", null, null, request.getRequestURI()));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<ForgotPasswordResponseDTO>> forgotPassword(@RequestBody @Valid ForgotPasswordRequestDTO forgotPasswordDTO, HttpServletRequest request) {
        ForgotPasswordResponseDTO responseDTO = accountService.forgotPasswordRequest(forgotPasswordDTO);
        return ResponseEntity.ok(new ApiResponse<>(true, "Forgot password email sent successfully", responseDTO, null, request.getRequestURI()));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@RequestBody @Valid ResetPasswordDTO resetPasswordDTO, HttpServletRequest request) {
        accountService.resetPassword(resetPasswordDTO);
        return ResponseEntity.ok(new ApiResponse<>(true, "Password reset successfully", null, null, request.getRequestURI()));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<OtpVerificationResponseDTO>> verifyOtp(@RequestBody @Valid OtpVerificationRequestDTO otpVerificationDTO, HttpServletRequest request) {
        OtpVerificationResponseDTO responseDTO = accountService.verifyOtp(otpVerificationDTO);
        return ResponseEntity.ok(new ApiResponse<>(true, "OTP verified successfully", responseDTO, null, request.getRequestURI()));
    }
}
