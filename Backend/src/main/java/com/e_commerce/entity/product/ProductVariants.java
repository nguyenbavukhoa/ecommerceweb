package com.e_commerce.entity.product;

import com.e_commerce.enums.ProductVariantsStatus;
import com.e_commerce.orther.Timestamped;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = false)
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class ProductVariants extends Timestamped {
    @Id
    private Integer id;

    @Column(nullable = false,name = "ProductId")
    private Integer productId;

    @Column(nullable = false,name = "SKU")
    private String sku;

    @Column(nullable = false,name = "StockQuantity")
    private Integer stockQuantity;

    @Column(nullable = false,name = "Price")
    private BigDecimal price;

    @Column(name = "ImgURL")
    private String imgUrl;

    @Column(nullable = false,name = "Status")
    @Enumerated(EnumType.STRING)
    private ProductVariantsStatus productVariantsStatus;
}
