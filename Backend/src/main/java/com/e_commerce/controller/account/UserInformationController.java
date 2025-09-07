package com.e_commerce.controller.account;

import com.e_commerce.dto.ApiResponse;
import com.e_commerce.dto.auth.userInfoDTO.UserInfoDTO;
import com.e_commerce.entity.account.UserInformation;
import com.e_commerce.service.account.UserInformationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/user-info")
@RequiredArgsConstructor
public class UserInformationController {
    private final UserInformationService userInformationService;
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<UserInfoDTO>>> getAllUserInfo(HttpServletRequest request){
        List<UserInfoDTO> allUserInfoByAccount = userInformationService.getAllUserInfoByAccount();
        return ResponseEntity.ok(new ApiResponse<>(true,"Get all user info successfully",allUserInfoByAccount,null,request.getRequestURI()));
    }
}
