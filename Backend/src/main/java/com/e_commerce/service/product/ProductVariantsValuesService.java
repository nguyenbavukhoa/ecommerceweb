package com.e_commerce.service.product;

import com.e_commerce.dto.product.productVariantValueDTO.ProductVariantValueCreateDTO;
import com.e_commerce.dto.product.productVariantValueDTO.ProductVariantValueDTO;
import com.e_commerce.dto.product.productVariantValueDTO.ProductVariantValueUpdateDTO;
import com.e_commerce.entity.product.ProductVariantValues;
import com.e_commerce.entity.product.ProductVariants;
import org.springframework.stereotype.Service;

@Service
public interface ProductVariantsValuesService {
    ProductVariantValues getProductVariantValueEntityById(Integer id);

    ProductVariantValueDTO createProductVariantValue(ProductVariantValueCreateDTO productVariantValueCreateDTO);

    ProductVariantValueDTO updateProductVariantValue(ProductVariantValueUpdateDTO productVariantValueUpdateDTO, Integer id);

    boolean isVariantValueAvailable(Integer variantId, Integer valueId, Integer requiredQuantity);

    boolean checkProductVariantAvailability(Integer productVariantId, Integer requiredQuantity);
}
