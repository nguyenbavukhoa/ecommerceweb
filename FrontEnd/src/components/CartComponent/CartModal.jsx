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
    // Giữ nguyên cấu trúc class cũ của bạn
    <div className="modal-cart open" onClick={closeCart}>
      <div className="cart-container" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="cart-header">
          <h3 className="cart-header-title">
            <i className="fa-regular fa-basket-shopping-simple"></i> Giỏ hàng
          </h3>
          <button className="cart-close" onClick={closeCart}>
            <i className="fa-sharp fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* BODY */}
        <div className="cart-body">
          {loading ? (
            <div style={{ padding: "20px", textAlign: "center" }}>
              Đang tải...
            </div>
          ) : !hasItems ? (
            <div
              className="gio-hang-trong"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "20px",
              }}
            >
              <i
                className="fa-thin fa-cart-xmark"
                style={{ fontSize: "40px", marginBottom: "10px" }}
              ></i>
              <p>Giỏ hàng trống</p>
            </div>
          ) : (
            <ul className="cart-list">
              {cartItems.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </ul>
          )}
        </div>

        {/* FOOTER */}
        <div className="cart-footer">
          <div className="cart-total-price">
            <p className="text-tt">Tổng tiền:</p>
            <p className="text-price">{vnd(getCartTotal())}</p>
          </div>
          <div className="cart-footer-payment">
            <button className="them-mon" onClick={closeCart}>
              <i className="fa-regular fa-plus"></i> Thêm món
            </button>
            <button
              className={`thanh-toan ${!hasSelectedItems ? "disabled" : ""}`}
              onClick={handleCheckout}
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
