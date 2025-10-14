package com.e_commerce.controller.product;

import com.e_commerce.dto.ApiResponse;
import com.e_commerce.dto.product.productVariantValueDTO.ProductVariantValueCreateDTO;
import com.e_commerce.dto.product.productVariantValueDTO.ProductVariantValueDTO;
import com.e_commerce.dto.product.optionValuesDTO.OptionValuesDTO;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/product-variant-values")
public class ProductVariantValueController {
    private final ProductVariantsValuesService productVariantsValuesService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<ProductVariantValueDTO>> createProductVariantValue(@ModelAttribute ProductVariantValueCreateDTO productVariantValueCreateDTO, HttpServletRequest request) {
        ProductVariantValueDTO createdVariantValue = productVariantsValuesService.createProductVariantValue(productVariantValueCreateDTO);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Product variant value created successfully", createdVariantValue, null, request.getRequestURI()));
    }

    @GetMapping("/is-available/{variantId}")
    public ResponseEntity<ApiResponse<Integer>> isVariantValueAvailable(@PathVariable Integer variantId, @RequestParam Integer valueId, HttpServletRequest request) {
        Integer availableQty = productVariantsValuesService.isVariantValueAvailable(variantId, valueId);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new ApiResponse<>(true, "Variant value availability checked successfully", availableQty, null, request.getRequestURI()));
    }

    @GetMapping("/values/{variantId}")
    public ResponseEntity<ApiResponse<List<OptionValuesDTO>>> getVariantValues(@PathVariable Integer variantId, HttpServletRequest request) {
        List<OptionValuesDTO> variantValues = productVariantsValuesService.getVariantValuesByProductVariantId(variantId);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new ApiResponse<>(true, "Variant values retrieved successfully", variantValues, null, request.getRequestURI()));
    }
}
