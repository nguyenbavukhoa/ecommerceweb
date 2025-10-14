package com.e_commerce.dto.product.productDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductUpdateDTO {
    private String name;

    private MultipartFile image;

    private boolean isActive;

    private String description;
}
