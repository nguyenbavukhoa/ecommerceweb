package com.e_commerce.entity.product;

import com.e_commerce.orther.Timestamped;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = false)
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class VariantOptions extends Timestamped {
    @Id
    private Integer id;

    @Column(name = "name")
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_categories_id", nullable = false)
    private ProductCategories productCategories;

    @OneToMany(mappedBy = "variantOptions", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<VariantValues> values;
}
