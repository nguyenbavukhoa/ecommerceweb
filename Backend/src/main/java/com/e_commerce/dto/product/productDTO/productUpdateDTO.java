package com.e_commerce.dto.product.productDTO;

import com.e_commerce.entity.product.ProductCategories;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class productUpdateDTO {
    private String name;

    private MultipartFile image;

    private boolean isActive;

    private ProductCategories productCategory;

    private String description;
}
