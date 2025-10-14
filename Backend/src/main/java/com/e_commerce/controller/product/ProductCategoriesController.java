package com.e_commerce.controller.product;

import com.e_commerce.dto.ApiResponse;
import com.e_commerce.dto.product.productCategoryDTO.ProductCategoryDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/product-categories")
@RequiredArgsConstructor
public class ProductCategoriesController {
    private final ProductCategoriesService productCategoriesService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductCategoryDTO>>> getAllProductCategories(@RequestParam Integer categoryId) {
        List<ProductCategoryDTO> productCategoryDTO = productCategoriesService.getProductCategoryByCategoryId(categoryId);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Get all product categories successfully", productCategoryDTO , null, "/product-categories/all")
        );
    }
}
