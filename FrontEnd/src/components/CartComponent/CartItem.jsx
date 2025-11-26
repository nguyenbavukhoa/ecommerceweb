// src/components/CartModalComponent/CartItem.jsx
import React from "react";
import { useCart } from "../../context/CartProvider";
import ImageWithFallback from "../ImageWithFallbackComponent/ImageWithFallback";
import styles from "./CartItem.module.css";

const CartItem = ({ item }) => {
  const {
    vnd,
    decreasingNumber,
    increasingNumber,
    toggleItemSelected,
    deleteCartItem,
  } = useCart();

  const itemClassName = `${styles.cartItem} ${
    item.selected ? styles.selected : ""
  }`;

  const handleActionClick = (e, action) => {
    e.stopPropagation();
    action();
  };

  return (
    <li className={itemClassName} key={item.id}>
      <div className={styles.cartItemSelection}>
        <button
          className={styles.confirmBtn}
          onClick={() => toggleItemSelected(item.id, !item.selected)}
        >
          {item.selected ? (
            <i className="fa-solid fa-circle-check"></i>
          ) : (
            <i className="fa-regular fa-circle"></i>
          )}
        </button>
      </div>

      <ImageWithFallback
        src={item.imgUrl}
        alt={item.productName}
        className={styles.cartItemImage}
      />

      <div className={styles.cartItemInfo}>
        <p className={styles.cartItemTitle}>{item.productName}</p>
        {item.optionValuesDTO && item.optionValuesDTO.length > 0 && (
          <p className={styles.cartItemOptions}>
            {item.optionValuesDTO.map((option) => option.value).join(" • ")}
          </p>
        )}
        <p className={styles.cartItemNote}>
          <i className="fa-light fa-pencil"></i>
          <span>{item.note || "Thêm ghi chú..."}</span>
        </p>
      </div>

      <div className={styles.cartItemFooter}>
        <div className={styles.cartItemPrice}>
          <span>{vnd(item.price)}</span>
        </div>
        <div className={styles.cartItemQuantity}>
          <div className={styles.buttons_added}>
            <input
              className={`${styles.minus} ${styles.isForm}`}
              type="button"
              value="-"
              onClick={(e) =>
                handleActionClick(e, () =>
                  decreasingNumber(item.id, item.quantity)
                )
              }
            />
            <input
              className={styles.inputQty}
              type="number"
              value={item.quantity}
              readOnly
              onClick={(e) => e.stopPropagation()}
            />
            <input
              className={`${styles.plus} ${styles.isForm}`}
              type="button"
              value="+"
              onClick={(e) =>
                handleActionClick(e, () =>
                  increasingNumber(item.id, item.quantity)
                )
              }
            />
          </div>
        </div>
      </div>

      <div className={styles.cartItemActions}>
        <button
          className={styles.deleteBtn}
          onClick={(e) => handleActionClick(e, () => deleteCartItem(item.id))}
        >
          <i className="fa-regular fa-trash-can"></i>
        </button>
      </div>
    </li>
  );
};

export default CartItem;
