package com.e_commerce.controller.product;

import com.e_commerce.dto.ApiResponse;
import com.e_commerce.dto.product.productVariants.ProductVariantsCreateDTO;
import com.e_commerce.dto.product.productVariants.ProductVariantsDTO;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/product-variants")
@RequiredArgsConstructor
public class ProductVariantsController {
    private final ProductVariantsService productVariantsService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<ProductVariantsDTO>> createProductVariant(@ModelAttribute ProductVariantsCreateDTO productVariantsCreateDTO, HttpServletRequest request) {
        ProductVariantsDTO createdVariant = productVariantsService.createProductVariant(productVariantsCreateDTO);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Product variant created successfully", createdVariant, null, request.getRequestURI()));
    }
}
