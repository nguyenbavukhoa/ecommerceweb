package com.e_commerce.controller.account;

import com.e_commerce.dto.ApiResponse;
import com.e_commerce.dto.auth.userInfoDTO.UserInfoCreateDTO;
import com.e_commerce.dto.auth.userInfoDTO.UserInfoDTO;
import com.e_commerce.dto.auth.userInfoDTO.UserInfoUpdateDTO;
import com.e_commerce.entity.account.UserInformation;
import com.e_commerce.service.account.UserInformationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping()
    public ResponseEntity<ApiResponse<UserInfoDTO>> createUserInfo(@Valid @RequestBody UserInfoCreateDTO userInfoDTO, HttpServletRequest request){
        UserInfoDTO createdUserInfo = userInformationService.createUserInfo(userInfoDTO);
        return ResponseEntity.ok(new ApiResponse<>(true,"Create user info successfully",createdUserInfo,null,request.getRequestURI()));
    }

    @PutMapping("/{userInfoId}")
    public ResponseEntity<ApiResponse<UserInfoDTO>> updateUserInfo(@PathVariable Integer userInfoId, @RequestBody UserInfoUpdateDTO userInfoUpdateDTO, HttpServletRequest request){
        UserInfoDTO updatedUserInfo = userInformationService.updateUserInfo(userInfoId,userInfoUpdateDTO);
        return ResponseEntity.ok(new ApiResponse<>(true,"Update user info successfully",updatedUserInfo,null,request.getRequestURI()));
    }

    @GetMapping("/{accountId}")
    public ResponseEntity<ApiResponse<List<UserInfoDTO>>> getUserInfoByAccountId(@PathVariable Integer accountId, HttpServletRequest request){
        List<UserInfoDTO> userInfoByAccountId = userInformationService.getUserInfoByAccountId(accountId);
        return ResponseEntity.ok(new ApiResponse<>(true,"Get user info by account id successfully",userInfoByAccountId,null,request.getRequestURI()));
    }
}
