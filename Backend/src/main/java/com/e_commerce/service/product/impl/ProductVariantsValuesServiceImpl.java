package com.e_commerce.service.product.impl;

import com.e_commerce.dto.product.productVariantValueDTO.ProductVariantValueCreateDTO;
import com.e_commerce.dto.product.productVariantValueDTO.ProductVariantValueDTO;
import com.e_commerce.dto.product.productVariantValueDTO.ProductVariantValueUpdateDTO;
import com.e_commerce.entity.product.ProductVariantValues;
import com.e_commerce.exceptions.CustomException;
import com.e_commerce.exceptions.ErrorResponse;
import com.e_commerce.mapper.product.ProductVariantsValueMapper;
import com.e_commerce.orther.IdGenerator;
import com.e_commerce.repository.product.ProductVariantValuesRepository;
import com.e_commerce.service.product.ProductVariantsService;
import com.e_commerce.service.product.ProductVariantsValuesService;
import com.e_commerce.service.product.VariantValuesService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ProductVariantsValuesServiceImpl implements ProductVariantsValuesService {
    private final ProductVariantsValueMapper productVariantsValueMapper;
    private final ProductVariantValuesRepository productVariantValuesRepository;
    private final VariantValuesService variantValuesService;
    private final ProductVariantsService productVariantsService;

    @Override
    public ProductVariantValues getProductVariantValueEntityById(Integer id) {
        return productVariantValuesRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorResponse.PRODUCT_VARIANT_VALUE_NOT_FOUND));
    }

    @Override
    public ProductVariantValueDTO createProductVariantValue(ProductVariantValueCreateDTO productVariantValueCreateDTO) {
        ProductVariantValues productVariantValues = productVariantsValueMapper.convertCreateDTOToEntity(productVariantValueCreateDTO);
        productVariantValues.setId(IdGenerator.getGenerationId());
        productVariantValues.setProductVariants(productVariantsService.getProductVariantEntityById(productVariantValueCreateDTO.getVariantId()));
        productVariantValues.setVariantValues(variantValuesService.getVariantValueEntityById(productVariantValueCreateDTO.getValueId()));
        return productVariantsValueMapper.convertEntityToDTO(productVariantValuesRepository.save(productVariantValues));
    }

    @Override
    public ProductVariantValueDTO updateProductVariantValue(ProductVariantValueUpdateDTO productVariantValueUpdateDTO, Integer id) {
        ProductVariantValues existingVariantValue = getProductVariantValueEntityById(id);
        if(productVariantValueUpdateDTO.getQuantity() != null) {
            existingVariantValue.setQuantity(productVariantValueUpdateDTO.getQuantity());
        }
        return null;
    }

    @Override
    public Integer isVariantValueAvailable(Integer variantId, Integer valueId) {
        return productVariantValuesRepository.isVariantValueAvailable(variantId, valueId);
    }

    @Override
    public void decreaseStock(Integer productVariantId, Integer variantValueId, Integer quantity) {
        int result = productVariantValuesRepository.decreaseStock(productVariantId, variantValueId, quantity);
        if (result == 0) {
            throw new CustomException(ErrorResponse.PRODUCT_VARIANT_VALUE_OUT_OF_STOCK);
        }
    }
}
