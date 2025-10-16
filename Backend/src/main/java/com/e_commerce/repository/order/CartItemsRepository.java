package com.e_commerce.repository.order;

import com.e_commerce.entity.order.CartItems;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CartItemsRepository extends JpaRepository<CartItems, Integer> {
    void deleteAllByIdIn(List<Integer> id);


    @Query("""
                SELECT ci
                FROM CartItems ci
                JOIN ci.selectedOptions ov
                WHERE ci.cart.id = :cartId
                  AND ci.product.id = :productId
                  AND ov.id IN :optionValueIds
                GROUP BY ci
                HAVING COUNT(ov.id) = :optionValueCount
            """)
    Optional<CartItems> findByCartIdAndProductIdAndOptionValues(
            @Param("cartId") Integer cartId,
            @Param("productId") Integer productId,
            @Param("optionValueIds") List<Integer> optionValueIds,
            @Param("optionValueCount") long optionValueCount
    );


    List<CartItems> findByCart_Account_Id(Integer id);

    void deleteAllByCart_Account_Id(Integer accountId);

    @Query("""
    SELECT ci
    FROM CartItems ci
    WHERE ci.cart.id = :cartId
      AND ci.id IN :cartItemIds
      AND ci.selected = true
""")
    List<CartItems> findSelectedCartItemsByCartIdAndId(
            @Param("cartId") Integer cartId,
            @Param("cartItemIds") List<Integer> cartItemIds
    );

    @Query("""
    SELECT ci
    FROM CartItems ci
    WHERE ci.cart.id = :cartId
      AND ci.selected = true
""")
    List<CartItems> findAllSelectedByCartId(Integer cartId);

    @Modifying
    @Query("UPDATE CartItems ci SET ci.selected = :selected WHERE ci.id = :id")
    void updateSelected(@Param("id") Integer id, @Param("selected") boolean selected);


    @Query("SELECT ci FROM CartItems ci WHERE ci.cart.account.id = :id")
    List<CartItems> findCartItemsByAccountId(@Param("id") Integer accountId);

}
