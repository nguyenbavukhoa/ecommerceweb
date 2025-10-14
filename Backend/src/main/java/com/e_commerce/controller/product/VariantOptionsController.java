package com.e_commerce.controller.product;

import com.e_commerce.dto.ApiResponse;
import com.e_commerce.dto.product.optionGroupDTO.OptionsGroupDTO;
import com.e_commerce.service.product.VariantOptionsService;
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
@RequestMapping("/variant-options")
@RequiredArgsConstructor
public class VariantOptionsController {
    private final VariantOptionsService variantOptionsService;

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse<List<OptionsGroupDTO>>> getVariantOptionsByCategoryId(@PathVariable Integer categoryId, HttpServletRequest request) {
        List<OptionsGroupDTO> variantOptions = variantOptionsService.getVariantOptionByProductCategoryId(categoryId);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new ApiResponse<>(true, "Variant options retrieved successfully", variantOptions, null, request.getRequestURI()));
    }
}
