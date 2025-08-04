package com.e_commerce.entity.product;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Product {
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

    @Column(name = "CreatedDate", nullable = false)
    private LocalDateTime createdDate;

    @Column(name = "UpdatedDate", nullable = false)
    private LocalDateTime updatedDate;

    @Column(name = "PriceBase", nullable = false)
    private BigDecimal priceBase;

    @ManyToOne
    @JoinColumn(name = "product_categories_id", nullable = false)
    private ProductCategories productCategory;
}
