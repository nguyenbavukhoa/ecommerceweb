package com.e_commerce.service.product;

import com.e_commerce.dto.product.productVariantValueDTO.ProductVariantValueCreateDTO;
import com.e_commerce.dto.product.productVariantValueDTO.ProductVariantValueDTO;
import com.e_commerce.dto.product.productVariantValueDTO.ProductVariantValueUpdateDTO;
import com.e_commerce.dto.product.optionValuesDTO.OptionValuesDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ProductVariantsValuesService {
    ProductVariantValues getProductVariantValueEntityById(Integer id);

    ProductVariantValueDTO createProductVariantValue(ProductVariantValueCreateDTO productVariantValueCreateDTO);

    ProductVariantValueDTO updateProductVariantValue(ProductVariantValueUpdateDTO productVariantValueUpdateDTO, Integer id);

    Integer isVariantValueAvailable(Integer variantId, Integer valueId);

    void decreaseStock(Integer productVariantId, Integer variantValueId, Integer quantity);

    List<OptionValuesDTO> getVariantValuesByProductVariantId(Integer variantId);
}
