package com.e_commerce.dto.product.productDTO;

import com.e_commerce.enums.AvailabilityStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductCreateDTO {
    @NotBlank(message = "Product name is required")
    @Size(max = 1000, message = "Product name cannot exceed 1000 characters")
    private String name;

    @NotNull(message = "Category is required")
    private Integer categoryId;

    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    private String description;

    @NotNull(message = "Image is required")
    private MultipartFile imgMain;

    @NotNull(message = "Base price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Base price must be greater than 0")
    private BigDecimal priceBase;

}
