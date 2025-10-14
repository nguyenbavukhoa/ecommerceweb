package com.e_commerce.service.product;

import com.e_commerce.dto.product.productVariants.ProductVariantsCreateDTO;
import com.e_commerce.dto.product.productVariants.ProductVariantsDTO;
import com.e_commerce.dto.product.productVariants.ProductVariantsUpdateDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ProductVariantsService {
    ProductVariants getProductVariantEntityById(Integer id);

    ProductVariantsDTO createProductVariant(ProductVariantsCreateDTO productVariantsCreateDTO);

    ProductVariantsDTO updateProductVariant(ProductVariantsUpdateDTO productVariantsUpdateDTO, Integer id);

    Integer checkProductVariantAvailability(Integer productVariantId);

    void decreaseStock(Integer productVariantId, Integer quantity);

    List<ProductVariantsDTO> getProductVariantsByProductId(Integer productId);
}
