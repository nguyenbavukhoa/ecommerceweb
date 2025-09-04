package com.e_commerce.service.product;

import com.e_commerce.dto.PageDTO;
import com.e_commerce.dto.product.productDTO.*;
import com.e_commerce.entity.product.Product;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public interface ProductService {
    ProductUserViewDTO getProductById(Integer id);

    Product getProductEntityById(Integer id);

    ProductDTO createProduct(ProductCreateDTO productCreateDTO);

    ProductDTO updateProduct(ProductUpdateDTO productUpdateDTO, Integer id);

    PageDTO<ProductDTO> getAllProductsAdmin(int page, int size, ProductFilter productFilter);
}
