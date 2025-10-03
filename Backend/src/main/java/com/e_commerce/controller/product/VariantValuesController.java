package com.e_commerce.controller.product;

import com.e_commerce.dto.ApiResponse;
import com.e_commerce.dto.product.variantValuesDTO.VariantValuesDTO;
import com.e_commerce.service.product.VariantValuesService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/variant-values")
@RequiredArgsConstructor
public class VariantValuesController {
    private final VariantValuesService variantValuesService;

    @GetMapping("/variant-option/{optionId}")
    public ResponseEntity<ApiResponse<List<VariantValuesDTO>>> getVariantValuesByVariantOptionId(@PathVariable Integer optionId, HttpServletRequest request) {
        List<VariantValuesDTO> variantValues = variantValuesService.getVariantValuesByVariantOptionId(optionId);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new ApiResponse<>(true, "Variant values retrieved successfully", variantValues, null, request.getRequestURI()));
    }
}
