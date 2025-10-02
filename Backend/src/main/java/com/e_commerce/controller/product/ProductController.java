package com.e_commerce.controller.product;

import com.e_commerce.dto.ApiResponse;
import com.e_commerce.dto.PageDTO;
import com.e_commerce.dto.product.productDTO.*;
import com.e_commerce.dto.product.productDTO.ProductUpdateDTO;
import com.e_commerce.service.product.ProductService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;



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

    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse<ProductDTO>> updateProduct(@PathVariable Integer id, @RequestBody ProductUpdateDTO productUpdateDTO, HttpServletRequest request) {
        ProductDTO updatedProduct = productService.updateProduct(id, productUpdateDTO);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Product updated successfully", updatedProduct, null, request.getRequestURI())
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageDTO<ProductDTO>>> getProducts(
            ProductFilter filter,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int size,
            HttpServletRequest request
    ) {
        PageDTO<ProductDTO> result = productService.getAllProductsAdmin(page,size, filter);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Get products successfully", result, null, request.getRequestURI())
        );
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<ApiResponse<ProductDetailDTO>> getProductDetail(@PathVariable Integer id, HttpServletRequest request) {
        ProductDetailDTO productDetail = productService.getProductDetail(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Get product detail successfully", productDetail, null, request.getRequestURI())
        );
    }
}
