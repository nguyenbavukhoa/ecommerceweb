package com.e_commerce.entity.product;

import com.e_commerce.orther.Timestamped;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = false)
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Product extends Timestamped {
    @Id
    private Integer id;

    @Column(name = "IsActive", nullable = false)
    private boolean isActive;

    @Column(name = "Name", nullable = false)
    private String name;

    @Column(name = "Description")
    private String description;

    @Column(name = "ImgMain")
    private String imgMain;

    @Column(name = "PriceBase", nullable = false)
    private BigDecimal priceBase;

    @ManyToOne
    @JoinColumn(name = "product_categories_id", nullable = false)
    private ProductCategories productCategory;
}
