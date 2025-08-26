package com.e_commerce.service.product;

import com.e_commerce.dto.product.productDTO.ProductCreateDTO;
import com.e_commerce.dto.product.productDTO.ProductDTO;
import com.e_commerce.dto.product.productDTO.ProductUpdateDTO;
import com.e_commerce.dto.product.productDTO.ProductUserViewDTO;
import com.e_commerce.entity.product.Product;
import org.springframework.stereotype.Service;

@Service
public interface ProductService {
    ProductUserViewDTO getProductById(Integer id);

    Product getProductEntityById(Integer id);

    ProductDTO createProduct(ProductCreateDTO productCreateDTO);

    ProductDTO updateProduct(ProductUpdateDTO productUpdateDTO, Integer id);
}
