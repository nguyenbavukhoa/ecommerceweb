package com.e_commerce.controller.product;


import com.e_commerce.dto.ApiResponse;
import com.e_commerce.dto.product.categoryDTO.CategoryDTO;
import com.e_commerce.service.product.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<CategoryDTO>>> getAllCategories() {
        List<CategoryDTO> categoryDTO = categoryService.getAllCategory();
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Get all categories successfully", categoryDTO , null, "/categories/all")
        );
    }

}
