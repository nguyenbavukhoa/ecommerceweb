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

  // [AN TOÀN] Fallback tên và ảnh để tránh lỗi hiển thị
  const displayName = item.productName || item.name || "Sản phẩm";
  const displayImg = item.imgUrl || item.imgMain || "";
  const displayPrice = item.price || item.priceBase || 0;

  return (
    <li className={itemClassName} key={item.id}>
      {/* Nút Checkbox */}
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

      {/* Ảnh sản phẩm */}
      <ImageWithFallback
        src={displayImg}
        alt={displayName}
        className={styles.cartItemImage}
      />

      {/* Thông tin Text */}
      <div className={styles.cartItemInfo}>
        <p className={styles.cartItemTitle}>{displayName}</p>

        {/* Option (Topping, Size...) */}
        {item.optionValuesDTO && item.optionValuesDTO.length > 0 && (
          <p className={styles.cartItemOptions}>
            {item.optionValuesDTO.map((option) => option.value).join(" • ")}
          </p>
        )}

        {/* Ghi chú */}
        <p className={styles.cartItemNote}>
          <i className="fa-light fa-pencil"></i>
          <span>{item.note || "Thêm ghi chú..."}</span>
        </p>
      </div>

      {/* Footer: Giá & Số lượng */}
      <div className={styles.cartItemFooter}>
        <div className={styles.cartItemPrice}>
          <span>{vnd(displayPrice)}</span>
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

      {/* Nút Xóa */}
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
