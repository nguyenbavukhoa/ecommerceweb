package com.e_commerce.controller.product;

import com.e_commerce.dto.ApiResponse;
import com.e_commerce.dto.product.productCategoryDTO.ProductCategoryDTO;
import com.e_commerce.entity.product.ProductCategories;
import com.e_commerce.service.product.ProductCategoriesService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
