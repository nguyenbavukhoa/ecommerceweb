package com.e_commerce.service.product.impl;

import com.e_commerce.dto.product.categoryDTO.CategoryCreateForm;
import com.e_commerce.dto.product.categoryDTO.CategoryDTO;
import com.e_commerce.dto.product.categoryDTO.CategoryUpdateForm;
import com.e_commerce.entity.product.Category;
import com.e_commerce.exceptions.CustomException;
import com.e_commerce.exceptions.ErrorResponse;
import com.e_commerce.mapper.product.CategoryMapper;
import com.e_commerce.orther.IdGenerator;
import com.e_commerce.repository.product.CategoryRepository;
import com.e_commerce.service.product.CategoryService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryMapper categoryMapper;
    private final CategoryRepository categoryRepository;

    @Override
    public Category getCategoryEntityById(Integer id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorResponse.CATEGORY_NOT_FOUND));
    }

    @Override
    public CategoryDTO createCategory(CategoryCreateForm categoryCreateForm) {
        if(categoryRepository.findByName(categoryCreateForm.getCategoryName()) != null) {
            throw new CustomException(ErrorResponse.CATEGORY_ALREADY_EXISTS);
        }
        Category category = categoryMapper.convertCreateDTOToEntity(categoryCreateForm);
        category.setId(IdGenerator.getGenerationId());
        return categoryMapper.convertEntityToDTO(categoryRepository.save(category));
    }

    @Override
    public CategoryDTO updateCategory(CategoryUpdateForm categoryUpdateForm, Integer id) {
        Category existingCategory = getCategoryEntityById(id);

        if(categoryUpdateForm.getName() != null) {
            if (categoryRepository.findByName(categoryUpdateForm.getName()) != null) {
                throw new CustomException(ErrorResponse.CATEGORY_ALREADY_EXISTS);
            }
            existingCategory.setName(categoryUpdateForm.getName());
        }
        return categoryMapper.convertEntityToDTO(categoryRepository.save(existingCategory));
    }

    @Override
    public void deleteCategory(Integer id) {
        if(!categoryRepository.existsById(id)) {
            throw new CustomException(ErrorResponse.CATEGORY_NOT_FOUND);
        }
        Category category = getCategoryEntityById(id);
        categoryRepository.delete(category);
    }


    @Override
    public List<CategoryDTO> getAllCategory() {
        return categoryMapper.convertPageToListDTO(categoryRepository.findAll());
    }
}
