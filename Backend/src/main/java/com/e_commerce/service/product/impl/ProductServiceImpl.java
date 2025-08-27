package com.e_commerce.service.product.impl;

import com.e_commerce.dto.product.productDTO.ProductCreateDTO;
import com.e_commerce.dto.product.productDTO.ProductDTO;
import com.e_commerce.dto.product.productDTO.ProductUpdateDTO;
import com.e_commerce.dto.product.productDTO.ProductUserViewDTO;
import com.e_commerce.entity.product.Product;
import com.e_commerce.mapper.product.ProductMapper;
import com.e_commerce.orther.IdGenerator;
import com.e_commerce.repository.product.ProductRepository;
import com.e_commerce.service.product.ProductCategoriesService;
import com.e_commerce.service.product.ProductService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final ProductCategoriesService productCategoriesService;

    @Override
    public ProductUserViewDTO getProductById(Integer id) {
        return productMapper.toProductUserViewDTO(getProductEntityById(id));
    }

    @Override
    public Product getProductEntityById(Integer id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    @Override
    public ProductDTO createProduct(ProductCreateDTO productCreateDTO) {
        Product product = productMapper.covertCreateDTOToEntity(productCreateDTO);
        product.setId(IdGenerator.getGenerationId());
        product.setProductCategory(productCategoriesService.getProductCategoryEntityById(productCreateDTO.getProductCategoryId()));
        return productMapper.covertEntityToDTO(productRepository.save(product));
    }

    @Override
    public ProductDTO updateProduct(ProductUpdateDTO productUpdateDTO, Integer id) {
        Product existingProduct = getProductEntityById(id);

        if(productUpdateDTO.getName() != null) {
            existingProduct.setName(productUpdateDTO.getName());
        }

        if(productUpdateDTO.getDescription() != null) {
            existingProduct.setDescription(productUpdateDTO.getDescription());
        }

        existingProduct.setActive(productUpdateDTO.isActive());

        if(productUpdateDTO.getProductCategory() != null) {
            existingProduct.setProductCategory(productUpdateDTO.getProductCategory());
        }

        if(productUpdateDTO.getImage() != null) {
            // Handle image update logic here
            // For example, save the new image and update the imgMain field
        }

        return productMapper.covertEntityToDTO(productRepository.save(existingProduct));
    }
}
