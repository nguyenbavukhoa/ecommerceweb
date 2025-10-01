package com.e_commerce.controller.voucher;

import com.e_commerce.dto.ApiResponse;
import com.e_commerce.dto.PageDTO;
import com.e_commerce.dto.voucher.VoucherCreateForm;
import com.e_commerce.dto.voucher.VoucherDTO;
import com.e_commerce.dto.voucher.VoucherFilter;
import com.e_commerce.service.voucher.VoucherService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/vouchers")
@RequiredArgsConstructor
public class VoucherController {
    private final VoucherService voucherService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<VoucherDTO>> createVoucher(@Valid @RequestBody VoucherCreateForm voucherCreateForm, HttpServletRequest request) {
        VoucherDTO voucherDTO = voucherService.createVoucher(voucherCreateForm);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Create voucher successfully", voucherDTO , null, request.getRequestURI())
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageDTO<VoucherDTO>>> getVouchers(
            VoucherFilter filter,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest request
    ) {
        PageDTO<VoucherDTO> result = voucherService.getAllVouchers(page,size, filter);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Get all vouchers successfully", result , null, "/vouchers")
        );
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteVoucher(@PathVariable Integer id, HttpServletRequest request) {
        voucherService.deleteVoucher(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Delete voucher successfully", null, null, request.getRequestURI())
        );
    }

    @GetMapping("/check/{code}")
    public ResponseEntity<ApiResponse<?>> checkVoucher(@PathVariable("code") String code, HttpServletRequest request) {
        var result = voucherService.checkVoucher(code);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Check voucher successfully", result , null, request.getRequestURI())
        );
    }
}
