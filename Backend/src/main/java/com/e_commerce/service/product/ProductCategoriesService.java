package com.e_commerce.service.product;

import com.e_commerce.dto.product.productCategoryDTO.ProductCategoryCreateDTO;
import com.e_commerce.dto.product.productCategoryDTO.ProductCategoryDTO;
import com.e_commerce.dto.product.productCategoryDTO.ProductCategoryUpdateDTO;
import com.e_commerce.dto.product.productDTO.ProductDTO;
import com.e_commerce.entity.product.ProductCategories;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ProductCategoriesService {
    ProductCategories getProductCategoryEntityById(Integer id);

    ProductCategoryDTO getProductCategoryById(Integer id);

    ProductCategoryDTO createProductCategory(ProductCategoryCreateDTO productCategoryCreateDTO);

    ProductCategoryDTO updateProductCategory(ProductCategoryUpdateDTO productCategoryUpdateDTO, Integer id);

    List<ProductCategoryDTO> getProductCategoryByCategoryId(Integer categoryId);
}
