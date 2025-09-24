package com.e_commerce.mapper.product;

import com.e_commerce.dto.product.productCategoryDTO.ProductCategoryCreateDTO;
import com.e_commerce.dto.product.productCategoryDTO.ProductCategoryDTO;
import com.e_commerce.dto.product.productCategoryDTO.ProductCategoryUpdateDTO;
import com.e_commerce.entity.product.ProductCategories;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProductCategoryMapper {
    public ProductCategoryDTO convertEntityToDTO(ProductCategories productCategories) {
        return ProductCategoryDTO.builder()
                .id(productCategories.getId())
                .name(productCategories.getName())
                .build();
    }

    public ProductCategories covertCreateDTOToEntity(ProductCategoryCreateDTO productCategoryCreateDTO) {
        return ProductCategories.builder()
                .name(productCategoryCreateDTO.getName())
                .build();
    }

    public ProductCategories convertUpdateDTOToEntity(ProductCategoryUpdateDTO productCategoryUpdateDTO) {
        return ProductCategories.builder()
                .name(productCategoryUpdateDTO.getName())
                .build();
    }

    public ProductCategories convertDTOToEntity(ProductCategoryDTO productCategoryDTO) {
        return ProductCategories.builder()
                .id(productCategoryDTO.getId())
                .name(productCategoryDTO.getName())
                .build();
    }

    public List<ProductCategoryDTO> convertPageToListDTO(List<ProductCategories> productCategoriesList) {
        return productCategoriesList.stream()
                .map(this::convertEntityToDTO)
                .collect(Collectors.toList());
    }
}
