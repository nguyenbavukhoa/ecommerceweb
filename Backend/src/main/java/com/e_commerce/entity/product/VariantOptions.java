package com.e_commerce.entity.product;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class VariantOptions {
    @Id
    private Integer id;

    @Column(name = "Name")
    private String name;

    @ManyToOne
    @JoinColumn(name = "ProductCategoriesId", nullable = false)
    private ProductCategories productCategories;
}
