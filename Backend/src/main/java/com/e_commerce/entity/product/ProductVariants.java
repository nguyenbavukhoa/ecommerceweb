package com.e_commerce.entity.product;

import com.e_commerce.enums.ProductVariantsStatus;
import com.e_commerce.orther.Timestamped;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = false)
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class ProductVariants extends Timestamped {
    @Id
    private Integer id;

    @ManyToOne
    @JoinColumn(nullable = false,name = "product_id")
    private Product product;

    @Column(nullable = false,name = "sku")
    private String sku;

    @Column(nullable = false,name = "stock_quantity")
    private Integer stockQuantity;

    @Column(nullable = false,name = "price")
    private BigDecimal price;

    @Column(name = "img_url")
    private String imgUrl;

    @Column(nullable = false,name = "status")
    @Enumerated(EnumType.STRING)
    private ProductVariantsStatus productVariantsStatus;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "variant_option_id")
    private VariantOptions variantOption;

    @OneToMany(mappedBy = "productVariants", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductVariantValues> productVariantValues;
}
