package com.e_commerce.dto.product.productVariants;

import com.e_commerce.entity.product.VariantOptions;
import com.e_commerce.enums.ProductVariantsStatus;
import jakarta.validation.constraints.*;
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
public class ProductVariantsCreateDTO {
    @NotNull(message = "ProductId is required")
    private Integer productId;

    @NotBlank(message = "SKU is required")
    @Size(max = 100, message = "SKU cannot exceed 100 characters")
    private String sku;

    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock quantity cannot be negative")
    private Integer stockQuantity;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;

    @NotBlank(message = "Image URL is required")
    private MultipartFile imgUrl;

    @NotNull(message = "Product variant status is required")
    private String productVariantsStatus;

    @NotNull(message = "VariantOptionId is required")
    private Integer variantOptionId;
}
