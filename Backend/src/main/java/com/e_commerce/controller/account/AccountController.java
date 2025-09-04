package com.e_commerce.controller.account;

import com.e_commerce.dto.ApiResponse;
import com.e_commerce.dto.auth.accountDTO.AccountDTO;
import com.e_commerce.dto.auth.accountDTO.AuthenticationDTO;
import com.e_commerce.dto.auth.accountDTO.LoginForm;
import com.e_commerce.dto.auth.accountDTO.RegistrationForm;
import com.e_commerce.service.account.AccountService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<ApiResponse<AuthenticationDTO>> login(@Valid @RequestBody LoginForm loginForm, HttpServletRequest request){
        AuthenticationDTO login = accountService.signIn(loginForm);
        return ResponseEntity.ok(new ApiResponse<>(true,"Login successfully" ,login ,null ,request.getRequestURI()));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AccountDTO>> register(@Valid @RequestBody RegistrationForm registrationForm, HttpServletRequest request) {
        AccountDTO register = accountService.createAccount(registrationForm);
        return ResponseEntity.ok(new ApiResponse<>(true, "Register successfully", register, null, request.getRequestURI()));
    }

    @GetMapping("/Customer")
    public ResponseEntity<ApiResponse<List<AccountDTO>>> getCustomerInfo(HttpServletRequest request) {
        List<AccountDTO> customerInfo = accountService.getCustomerInfoList();
        return ResponseEntity.ok(new ApiResponse<>(true, "Get customer info successfully", customerInfo, null, request.getRequestURI()));
    }
}
