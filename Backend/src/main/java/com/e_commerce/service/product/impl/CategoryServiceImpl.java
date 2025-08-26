package com.e_commerce.service.product.impl;

import com.e_commerce.dto.product.categoryDTO.CategoryCreateForm;
import com.e_commerce.dto.product.categoryDTO.CategoryDTO;
import com.e_commerce.dto.product.categoryDTO.CategoryUpdateForm;
import com.e_commerce.entity.product.Category;
import com.e_commerce.mapper.product.CategoryMapper;
import com.e_commerce.orther.IdGenerator;
import com.e_commerce.repository.product.CategoryRepository;
import com.e_commerce.service.product.CategoryService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryMapper categoryMapper;
    private final CategoryRepository categoryRepository;

    @Override
    public Category getCategoryEntityById(Integer id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
    }

    @Override
    public CategoryDTO createCategory(CategoryCreateForm categoryCreateForm) {
        Category category = categoryMapper.convertCreateDTOToEntity(categoryCreateForm);
        category.setId(IdGenerator.getGenerationId());
        return categoryMapper.convertEntityToDTO(categoryRepository.save(category));
    }

    @Override
    public CategoryDTO updateCategory(CategoryUpdateForm categoryUpdateForm, Integer id) {
        Category existingCategory = getCategoryEntityById(id);
        if(categoryUpdateForm.getName() != null) {
            existingCategory.setName(categoryUpdateForm.getName());
        }
        return categoryMapper.convertEntityToDTO(categoryRepository.save(existingCategory));

    }
}
