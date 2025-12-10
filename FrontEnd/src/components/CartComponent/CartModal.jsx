// src/components/CartModalComponent/CartModal.jsx
import { useCart } from "../../context/CartProvider";
import CartItem from "./CartItem";
import { useNavigate } from "react-router-dom";

const CartModal = () => {
  const {
    isOpen,
    closeCart,
    cartItems,
    loading,
    vnd,
    getCartTotal,
    hasSelectedItems,
  } = useCart();

  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!hasSelectedItems) return;
    closeCart();
    navigate("/checkout");
  };

  if (!isOpen) return null;

  const hasItems = cartItems && cartItems.length > 0;

  return (
    // Backdrop đóng modal
    <div className="modal-cart open" onClick={closeCart}>
      {/* Container chính, chặn nổi bọt sự kiện click */}
      <div className="cart-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-header">
          <h3 className="cart-header-title">
            <i className="fa-regular fa-basket-shopping-simple"></i> Giỏ hàng
          </h3>
          <button className="cart-close" onClick={closeCart}>
            <i className="fa-sharp fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Body */}
        <div className="cart-body">
          {loading ? (
            <div style={{ padding: "20px", textAlign: "center" }}>
              Đang cập nhật giỏ hàng...
            </div>
          ) : !hasItems ? (
            <div className="gio-hang-trong">
              <i className="fa-thin fa-cart-xmark"></i>
              <p>Không có sản phẩm nào trong giỏ hàng của bạn</p>
            </div>
          ) : (
            <ul className="cart-list">
              {cartItems.map((item) => (
                // Dùng ID làm key (nếu ID trùng do lỗi data thì dùng index fallback)
                <CartItem key={item.id || Math.random()} item={item} />
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="cart-footer">
          <div className="cart-total-price">
            <p className="text-tt">Tổng tiền:</p>
            <p className="text-price">{vnd(getCartTotal() || 0)}</p>
          </div>
          <div className="cart-footer-payment">
            <button className="them-mon" onClick={closeCart}>
              <i className="fa-regular fa-plus"></i> Thêm món
            </button>
            <button
              className={`thanh-toan ${!hasSelectedItems ? "disabled" : ""}`}
              onClick={handleCheckout}
              disabled={!hasSelectedItems}
            >
              Thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
