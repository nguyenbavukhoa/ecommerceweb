package com.e_commerce.mapper.product;

import com.e_commerce.dto.product.categoryDTO.CategoryCreateForm;
import com.e_commerce.dto.product.categoryDTO.CategoryDTO;
import com.e_commerce.dto.product.categoryDTO.CategoryUpdateForm;
import com.e_commerce.entity.product.Category;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class CategoryMapper {
    public CategoryDTO convertEntityToDTO(Category category) {
        return CategoryDTO.builder()
                .id(category.getId())
                .name(category.getName())
                .build();
    }

    public Category convertCreateDTOToEntity(CategoryCreateForm categoryDTO) {
        return Category.builder()
                .name(categoryDTO.getCategoryName())
                .build();
    }

    public Category convertUpdateDTOToEntity(CategoryUpdateForm categoryDTO) {
        return Category.builder()
                .name(categoryDTO.getName())
                .build();
    }

    public List<CategoryDTO> convertPageToListDTO(List<Category> categoryList) {
        return categoryList.stream()
                .map(this::convertEntityToDTO)
                .collect(Collectors.toList());
    }
}
