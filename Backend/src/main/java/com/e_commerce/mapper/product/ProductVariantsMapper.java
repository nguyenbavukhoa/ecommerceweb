package com.e_commerce.mapper.product;

import com.e_commerce.dto.product.productVariants.ProductVariantsCreateDTO;
import com.e_commerce.dto.product.productVariants.ProductVariantsDTO;
import com.e_commerce.dto.product.productVariants.ProductVariantsUpdateDTO;
import com.e_commerce.entity.product.ProductVariants;
import com.e_commerce.enums.ProductVariantsStatus;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class ProductVariantsMapper {
    public ProductVariantsDTO covertEntityToDTO(ProductVariants productVariants) {
        return ProductVariantsDTO.builder()
                .id(productVariants.getId())
                .productId(productVariants.getProduct().getId())
                .sku(productVariants.getSku())
                .price(productVariants.getPrice())
                .stock(productVariants.getStockQuantity())
                .build();
    }

    public ProductVariants covertCreateDTOToEntity(ProductVariantsCreateDTO productVariantsCreateDTO) {
        return ProductVariants.builder()
                .price(productVariantsCreateDTO.getPrice())
                .stockQuantity(productVariantsCreateDTO.getStockQuantity())
                .sku(productVariantsCreateDTO.getSku())
                .productVariantsStatus(ProductVariantsStatus.valueOf(productVariantsCreateDTO.getProductVariantsStatus()))
                .build();
    }

    public  ProductVariants covertUpdateDTOToEntity(ProductVariantsUpdateDTO productVariantsUpdateDTO) {
        return ProductVariants.builder()
                .price(productVariantsUpdateDTO.getPrice())
                .stockQuantity(productVariantsUpdateDTO.getStockQuantity())
                .sku(productVariantsUpdateDTO.getSku())
                .imgUrl(productVariantsUpdateDTO.getImgUrl())
                .productVariantsStatus(productVariantsUpdateDTO.getProductVariantsStatus())
                .build();
    }

    public List<ProductVariantsDTO> convertPageToListDTO(List<ProductVariants> productVariantsList) {
        return productVariantsList.stream()
                .map(this::covertEntityToDTO)
                .toList();
    }
}
