package com.e_commerce.service.product.impl;

import com.e_commerce.dto.product.productCategoryDTO.ProductCategoryCreateDTO;
import com.e_commerce.dto.product.productCategoryDTO.ProductCategoryDTO;
import com.e_commerce.dto.product.productCategoryDTO.ProductCategoryUpdateDTO;
import com.e_commerce.entity.product.ProductCategories;
import com.e_commerce.mapper.product.ProductCategoryMapper;
import com.e_commerce.orther.IdGenerator;
import com.e_commerce.repository.product.ProductCategoryRepository;
import com.e_commerce.service.product.ProductCategoriesService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ProductCategoriesServiceImpl implements ProductCategoriesService {
    private final ProductCategoryRepository productCategoryRepository;
    private final ProductCategoryMapper productCategoryMapper;

    @Override
    public ProductCategories getProductCategoryEntityById(Integer id) {
        return productCategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product category not found with id: " + id));
    }

    @Override
    public ProductCategoryDTO getProductCategoryById(Integer id) {
        return productCategoryMapper.convertEntityToDTO(getProductCategoryEntityById(id));
    }

    @Override
    public ProductCategoryDTO createProductCategory(ProductCategoryCreateDTO productCategoryCreateDTO) {
        ProductCategories productCategories = productCategoryMapper.covertCreateDTOToEntity(productCategoryCreateDTO);
        productCategories.setId(IdGenerator.getGenerationId());
        return productCategoryMapper.convertEntityToDTO(productCategoryRepository.save(productCategories));
    }

    @Override
    public ProductCategoryDTO updateProductCategory(ProductCategoryUpdateDTO productCategoryUpdateDTO, Integer id) {
        ProductCategories existingCategory = getProductCategoryEntityById(id);

        if(productCategoryUpdateDTO.getName() != null) {
            existingCategory.setName(productCategoryUpdateDTO.getName());
        }
        return productCategoryMapper.convertEntityToDTO(productCategoryRepository.save(existingCategory));
    }
}
