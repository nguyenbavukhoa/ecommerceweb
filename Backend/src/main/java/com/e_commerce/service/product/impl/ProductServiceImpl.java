package com.e_commerce.service.product.impl;

import com.e_commerce.dto.PageDTO;
import com.e_commerce.dto.product.productDTO.*;
import com.e_commerce.entity.product.Product;
import com.e_commerce.exceptions.CustomException;
import com.e_commerce.exceptions.ErrorResponse;
import com.e_commerce.mapper.product.ProductMapper;
import com.e_commerce.orther.CloudinaryService;
import com.e_commerce.orther.IdGenerator;
import com.e_commerce.repository.product.ProductRepository;
import com.e_commerce.service.product.ProductCategoriesService;
import com.e_commerce.service.product.ProductService;
import com.e_commerce.specification.ProductSpecification;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@AllArgsConstructor
@Slf4j
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final ProductCategoriesService productCategoriesService;
    private final CloudinaryService cloudinaryService;

    @Override
    public ProductUserViewDTO getProductById(Integer id) {
        return productMapper.toProductUserViewDTO(getProductEntityById(id));
    }

    @Override
    public Product getProductEntityById(Integer id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorResponse.PRODUCT_ALREADY_EXISTS));
    }

    @Override
    public ProductDTO createProduct(ProductCreateDTO productCreateDTO) {
        Product product = productMapper.covertCreateDTOToEntity(productCreateDTO);
        product.setId(IdGenerator.getGenerationId());
        product.setProductCategory(productCategoriesService.getProductCategoryEntityById(productCreateDTO.getProductCategoryId()));

        if (productCreateDTO.getImgMain() != null && !productCreateDTO.getImgMain().isEmpty()) {
            Map<String, Object> imageUrl = cloudinaryService.uploadFile(productCreateDTO.getImgMain(), "product");
            log.info("Image upload result: {}", imageUrl);
            product.setImgMain((String) imageUrl.get("url"));
        } else {
            throw new CustomException(ErrorResponse.PRODUCT_IMAGE_INVALID);
        }
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

        if(productUpdateDTO.getImage() != null && !productUpdateDTO.getImage().isEmpty()) {
           if(existingProduct.getImgMain() != null && !existingProduct.getImgMain().isEmpty()) {
                log.info("Existing image URL: {}", existingProduct.getImgMain());
                String oldPublicId = cloudinaryService.extractPublicId(existingProduct.getImgMain());
                cloudinaryService.deleteFile(oldPublicId);
                log.info("Deleted old image with public ID: {}", oldPublicId);
           }
            Map<String, Object> imageUrl = cloudinaryService.uploadFile(productUpdateDTO.getImage(), "product");
            log.info("Image upload result: {}", imageUrl);
            existingProduct.setImgMain((String) imageUrl.get("url"));
        }

        return productMapper.covertEntityToDTO(productRepository.save(existingProduct));
    }

    @Override
    public PageDTO<ProductDTO> getAllProductsAdmin(int page, int size, ProductFilter productFilter) {
        Specification<Product> specification = ProductSpecification.filterProduct(productFilter);
        Pageable pageable = PageRequest.of(page-1, size);

        return productMapper.convertProductPageToDTO(productRepository.findAll(specification, pageable));
    }
}
