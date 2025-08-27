package com.e_commerce.service.product.impl;

import com.e_commerce.dto.product.productVariants.ProductVariantsCreateDTO;
import com.e_commerce.dto.product.productVariants.ProductVariantsDTO;
import com.e_commerce.dto.product.productVariants.ProductVariantsUpdateDTO;
import com.e_commerce.entity.product.ProductVariants;
import com.e_commerce.mapper.product.ProductVariantsMapper;
import com.e_commerce.orther.IdGenerator;
import com.e_commerce.repository.product.ProductVariantRepository;
import com.e_commerce.service.product.ProductService;
import com.e_commerce.service.product.ProductVariantsService;
import com.e_commerce.service.product.VariantOptionsService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ProductVariantsServiceImpl implements ProductVariantsService {
    private final ProductVariantRepository productVariantRepository;
    private final ProductVariantsMapper productVariantsMapper;
    private final ProductService productService;
    private final VariantOptionsService variantOptionsService;

    @Override
    public ProductVariants getProductVariantEntityById(Integer id) {
        return productVariantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product variant not found with id: " + id));
    }

    @Override
    public ProductVariantsDTO createProductVariant(ProductVariantsCreateDTO productVariantsCreateDTO) {
        ProductVariants productVariants = productVariantsMapper.covertCreateDTOToEntity(productVariantsCreateDTO);
        productVariants.setId(IdGenerator.getGenerationId());
        productVariants.setProductId(productService.getProductEntityById(productVariantsCreateDTO.getProductId()));
        productVariants.setVariantOption(variantOptionsService.getVariantOptionEntityById(productVariantsCreateDTO.getVariantOptionId()));
        return productVariantsMapper.covertEntityToDTO(productVariantRepository.save(productVariants));
    }

    @Override
    public ProductVariantsDTO updateProductVariant(ProductVariantsUpdateDTO productVariantsUpdateDTO, Integer id) {
        ProductVariants existingVariant = getProductVariantEntityById(id);
        if(productVariantsUpdateDTO.getPrice() != null) {
            existingVariant.setPrice(productVariantsUpdateDTO.getPrice());
        }
        if(productVariantsUpdateDTO.getStockQuantity() != null) {
            existingVariant.setStockQuantity(productVariantsUpdateDTO.getStockQuantity());
        }
        if(productVariantsUpdateDTO.getSku() != null) {
            existingVariant.setSku(productVariantsUpdateDTO.getSku());
        }
        if(productVariantsUpdateDTO.getImgUrl() != null) {
            // Handle image update logic here
            // For example, save the new image and update the imgUrl field
        }
        if(productVariantsUpdateDTO.getProductVariantsStatus() != null) {
            existingVariant.setProductVariantsStatus(productVariantsUpdateDTO.getProductVariantsStatus());
        }
        return productVariantsMapper.covertEntityToDTO(productVariantRepository.save(existingVariant));
    }
}
