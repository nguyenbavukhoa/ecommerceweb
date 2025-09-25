package com.e_commerce.controller.product;

import com.e_commerce.dto.ApiResponse;
import com.e_commerce.dto.product.productVariantValueDTO.ProductVariantValueCreateDTO;
import com.e_commerce.dto.product.productVariantValueDTO.ProductVariantValueDTO;
import com.e_commerce.service.product.ProductVariantsValuesService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/product-variant-values")
@CrossOrigin(origins = "*")
public class ProductVariantValueController {
    private final ProductVariantsValuesService productVariantsValuesService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<ProductVariantValueDTO>> createProductVariantValue(@ModelAttribute ProductVariantValueCreateDTO productVariantValueCreateDTO, HttpServletRequest request) {
        ProductVariantValueDTO createdVariantValue = productVariantsValuesService.createProductVariantValue(productVariantValueCreateDTO);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Product variant value created successfully", createdVariantValue, null, request.getRequestURI()));
    }
}
