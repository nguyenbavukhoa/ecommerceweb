package com.e_commerce.controller.product;

import com.e_commerce.dto.ApiResponse;
import com.e_commerce.dto.product.productDTO.ProductCreateDTO;
import com.e_commerce.dto.product.productDTO.ProductDTO;
import com.e_commerce.service.product.ProductService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<ProductDTO>> createProduct(@ModelAttribute ProductCreateDTO productCreateDTO, HttpServletRequest request) {
        ProductDTO createdProduct = productService.createProduct(productCreateDTO);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Product created successfully", createdProduct, null, request.getRequestURI()));
    }
}
