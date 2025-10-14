package com.e_commerce.mapper.product;

import com.e_commerce.dto.PageDTO;
import com.e_commerce.dto.product.productDTO.*;
import com.e_commerce.entity.product.Product;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ProductMapper {
    public ProductDTO covertEntityToDTO(Product product) {
        return ProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .status(product.getStatus())
                .priceBase(product.getPriceBase())
                .description(product.getDescription())
                .imgMain(product.getImgMain())
                .build();
    }

    public ProductUserViewDTO toProductUserViewDTO(Product product) {
        return ProductUserViewDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .status(product.getStatus())
                .priceBase(product.getPriceBase())
                .imgMain(product.getImgMain())
                .build();
    }

    public ProductDetailDTO toProductDetailDTO(Product product) {
        return ProductDetailDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .basePrice(product.getPriceBase())
                .imgUrl(product.getImgMain())
                .status(product.getStatus())
                .build();
    }

    public Product covertDTOToEntity(ProductDTO productDTO) {
            return Product.builder()
                .id(productDTO.getId())
                .name(productDTO.getName())
                .status(productDTO.getStatus())
                .priceBase(productDTO.getPriceBase())
                .description(productDTO.getDescription())
                .imgMain(productDTO.getImgMain())
                .build();
    }

    public Product covertCreateDTOToEntity(ProductCreateDTO productCreateDTO) {
        return Product.builder()
                .name(productCreateDTO.getName())
                .priceBase(productCreateDTO.getPriceBase())
                .description(productCreateDTO.getDescription())
                .build();
    }

    public Product convertUpdateDTOToEntity(ProductUpdateDTO productUpdateDTO) {
        return Product.builder()
                .name(productUpdateDTO.getName())
                .status(productUpdateDTO.getStatus())
                .description(productUpdateDTO.getDescription())
                .imgMain(productUpdateDTO.getImage() != null ? productUpdateDTO.getImage().getOriginalFilename() : null)
                .build();
    }

    public PageDTO<ProductDTO> convertProductPageToDTO(Page<Product> productPage) {
        return PageDTO.<ProductDTO>builder()
                .content(productPage.getContent().stream()
                        .map(this::covertEntityToDTO)
                        .collect(Collectors.toList()))
                .page(productPage.getNumber())
                .size(productPage.getSize())
                .totalElements(productPage.getTotalElements())
                .totalPages(productPage.getTotalPages())
                .build();
    }

    public List<ProductUserViewDTO> convertPageToListDTO(List<Product> products) {
        return products.stream()
                .map(this::toProductUserViewDTO)
                .collect(Collectors.toList());
    }
}
