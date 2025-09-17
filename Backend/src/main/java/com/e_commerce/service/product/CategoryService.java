package com.e_commerce.service.product;

import com.e_commerce.dto.product.categoryDTO.CategoryCreateForm;
import com.e_commerce.dto.product.categoryDTO.CategoryDTO;
import com.e_commerce.dto.product.categoryDTO.CategoryUpdateForm;
import com.e_commerce.entity.product.Category;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CategoryService {
    Category getCategoryEntityById(Integer id);

    CategoryDTO createCategory(CategoryCreateForm categoryCreateForm);

    CategoryDTO updateCategory(CategoryUpdateForm categoryUpdateForm, Integer id);

    void deleteCategory(Integer id);

    List<CategoryDTO> getAllCategory();
}
