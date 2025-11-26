// src/components/CartModalComponent/CartModal.jsx
import { useCart } from "../../context/CartProvider";
import CartItem from "./CartItem"; // Import component con
import { useNavigate } from "react-router-dom"; // 👇 1. Import useNavigate
const CartModal = () => {
  const {
    isOpen,
    closeCart,
    cartItems,
    loading,
    vnd,
    getCartTotal,
    hasSelectedItems, // Lấy hasSelectedItems từ context
  } = useCart();

  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!hasSelectedItems) return; // Kiểm tra dựa trên biến đã có
    closeCart();
    navigate("/checkout");
  };

  // Nếu modal không mở, không render gì cả
  if (!isOpen) return null;

  const hasItems = cartItems && cartItems.length > 0;

  console.log(cartItems);

  return (
    // Thêm onClick để đóng modal khi click ra ngoài
    <div className="modal-cart open" onClick={closeCart}>
      {/* Thêm e.stopPropagation() để không bị đóng khi click vào nội dung */}
      <div className="cart-container" onClick={(e) => e.stopPropagation()}>
        {/* ===== Header (Giữ nguyên class) ===== */}
        <div className="cart-header">
          <h3 className="cart-header-title">
            <i className="fa-regular fa-basket-shopping-simple"></i> Giỏ hàng
          </h3>
          <button className="cart-close" onClick={closeCart}>
            <i className="fa-sharp fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* ===== Body (Giữ nguyên class) ===== */}
        <div className="cart-body">
          {loading ? (
            <div>Đang tải giỏ hàng...</div>
          ) : !hasItems ? (
            // Hiển thị khi giỏ hàng trống
            <div className="gio-hang-trong" style={{ display: "flex" }}>
              <i className="fa-thin fa-cart-xmark"></i>
              <p>Không có sản phẩm nào trong giỏ hàng của bạn</p>
            </div>
          ) : (
            // Hiển thị danh sách sản phẩm
            <ul className="cart-list">
              {cartItems.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </ul>
          )}
        </div>

        {/* ===== Footer (Giữ nguyên class) ===== */}
        <div className="cart-footer">
          <div className="cart-total-price">
            <p className="text-tt">Tổng tiền:</p>
            {/* Cập nhật giá động */}
            <p className="text-price">{vnd(getCartTotal() || 0)}</p>
          </div>
          <div className="cart-footer-payment">
            <button className="them-mon" onClick={closeCart}>
              <i className="fa-regular fa-plus"></i> Thêm món
            </button>
            {/* Thêm class 'disabled' một cách động */}
            <button
              className={`thanh-toan ${!hasSelectedItems ? "disabled" : ""}`}
              onClick={handleCheckout} // 👇 5. Gọi hàm điều hướng
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
