package com.e_commerce.service.product.impl;

import com.e_commerce.dto.product.productVariants.ProductVariantsCreateDTO;
import com.e_commerce.dto.product.productVariants.ProductVariantsDTO;
import com.e_commerce.dto.product.productVariants.ProductVariantsUpdateDTO;
import com.e_commerce.entity.product.ProductVariants;
import com.e_commerce.exceptions.CustomException;
import com.e_commerce.exceptions.ErrorResponse;
import com.e_commerce.mapper.product.ProductVariantsMapper;
import com.e_commerce.orther.CloudinaryService;
import com.e_commerce.orther.IdGenerator;
import com.e_commerce.repository.product.ProductVariantRepository;
import com.e_commerce.service.product.ProductService;
import com.e_commerce.service.product.ProductVariantsService;
import com.e_commerce.service.product.VariantOptionsService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@AllArgsConstructor
public class ProductVariantsServiceImpl implements ProductVariantsService {
    private final ProductVariantRepository productVariantRepository;
    private final ProductVariantsMapper productVariantsMapper;
    private final ProductService productService;
    private final VariantOptionsService variantOptionsService;
    private final CloudinaryService cloudinaryService;

    @Override
    public ProductVariants getProductVariantEntityById(Integer id) {
        return productVariantRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorResponse.PRODUCT_VARIANT_NOT_FOUND));
    }

    @Override
    public ProductVariantsDTO createProductVariant(ProductVariantsCreateDTO productVariantsCreateDTO) {
        ProductVariants productVariants = productVariantsMapper.covertCreateDTOToEntity(productVariantsCreateDTO);
        productVariants.setId(IdGenerator.getGenerationId());
        productVariants.setProduct(productService.getProductEntityById(productVariantsCreateDTO.getProductId()));
        productVariants.setVariantOption(variantOptionsService.getVariantOptionEntityById(productVariantsCreateDTO.getVariantOptionId()));

        if (productVariantsCreateDTO.getImgUrl() != null || !productVariantsCreateDTO.getImgUrl().isEmpty()) {
            Map<String, Object> imageUrl = cloudinaryService.uploadFile(productVariantsCreateDTO.getImgUrl(), "product_variant");
            productVariants.setImgUrl((String) imageUrl.get("url"));
        }
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

    @Override
    public Integer checkProductVariantAvailability(Integer productVariantId) {
        Integer availableQty = productVariantRepository.checkProductVariantAvailability(productVariantId);
        if (availableQty == null) {
            throw new CustomException(ErrorResponse.PRODUCT_VARIANT_NOT_FOUND);
        }
        if (availableQty <= 0) {
            throw new CustomException(ErrorResponse.PRODUCT_VARIANT_OUT_OF_STOCK);
        }
        return availableQty;
    }

    @Override
    public void decreaseStock(Integer productVariantId, Integer quantity) {
        int result = productVariantRepository.decreaseStock(productVariantId, quantity);
        if (result == 0) {
            throw new CustomException(ErrorResponse.PRODUCT_VARIANT_OUT_OF_STOCK);
        }
    }

    @Override
    public List<ProductVariantsDTO> getProductVariantsByProductId(Integer productId) {
        return productVariantsMapper.convertPageToListDTO(productVariantRepository.findByProductId(productId));
    }
}
