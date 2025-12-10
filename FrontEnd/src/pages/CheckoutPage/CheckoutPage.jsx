// src/pages/CheckoutPage/CheckoutPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartProvider";
import { useAuth } from "../../context/AuthContext";
// [QUAN TRỌNG] Hook này giờ đã chứa toàn bộ logic tạo đơn hàng
import { useCheckoutForm } from "../../Hooks/useCheckoutForm";
import DeliveryAddress from "../../components/DeliveryAddress/DeliveryAddress";
import styles from "./CheckoutPage.module.css";
import VNPAYModal from "./Modals/VNPAYModal";
import VnpayLogo from "../../assets/icon/vnpay_logo.svg";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, vnd } = useCart();
  const { auth } = useAuth();

  // Gọi Hook Checkout Form
  const {
    state,
    isSubmitting, // Biến loading khi đang gửi đơn
    handleInputChange,
    handlePaymentMethodChange,
    handlePlaceOrder, // Hàm đặt hàng "thần thánh" (đã bao gồm validate, gọi API, clear giỏ)
  } = useCheckoutForm();

  // Tính toán tiền nong (UI only)
  const selectedItems = cartItems.filter((item) => item.selected);
  const subTotal = selectedItems.reduce(
    (sum, item) => sum + (item.price || item.priceBase || 0) * item.quantity,
    0
  );
  const shippingFee = 15000;
  const finalTotal = subTotal + shippingFee;

  // State riêng cho Modal VNPay
  const [isVnPayModalOpen, setIsVnPayModalOpen] = useState(false);

  // Wrapper để xử lý sự kiện click nút "Đặt hàng"
  const onPlaceOrderClick = () => {
    // Nếu chọn VNPay -> Mở Modal trước
    if (state.paymentMethod === "VNPAY") {
      setIsVnPayModalOpen(true);
    } else {
      // Tiền mặt -> Gọi luôn hàm đặt hàng
      handlePlaceOrder();
    }
  };

  // Callback khi thanh toán VNPay thành công
  const onVnPaySuccess = () => {
    setIsVnPayModalOpen(false);
    // Gọi hàm đặt hàng thật sự sau khi thanh toán xong
    handlePlaceOrder();
  };

  return (
    <div className={styles.checkoutPage}>
      <header className={styles.checkoutHeader}>
        <div className={styles.checkoutReturn}>
          <button onClick={() => navigate(-1)}>
            <i className="fa-regular fa-chevron-left"></i>
          </button>
        </div>
        <h2 className={styles.checkoutTitle}>Thanh toán</h2>
      </header>

      <main className={styles.checkoutSection}>
        <div className={styles.checkoutColLeft}>
          <div className={styles.checkoutRow}>
            <div className={styles.checkoutColTitle}>Thông tin người nhận</div>
            {/* Component này cần trả về name, phone, address để hook update state */}
            {/* Tạm thời giả định DeliveryAddress tự update vào auth context hoặc dùng callback */}
            <DeliveryAddress
            // Nếu DeliveryAddress có prop onChange, hãy map nó vào handleInputChange
            // Ví dụ: onAddressChange={(info) => { ...update state... }}
            // Tuy nhiên, logic DeliveryAddress của bạn khá phức tạp nên mình giữ nguyên
            // Hy vọng DeliveryAddress cập nhật thẳng vào AuthContext hoặc LocalStorage
            />

            {/* Form nhập tay nếu DeliveryAddress chưa cover hết (Fallback) */}
            {/*<div className={styles.contentGroup} style={{ marginTop: 10 }}>
              <input
                type="text"
                name="name"
                placeholder="Tên người nhận"
                value={state.name}
                onChange={handleInputChange}
                className={styles.formControl}
                style={{ marginBottom: 10 }}
              />
              <input
                type="text"
                name="phone"
                placeholder="Số điện thoại"
                value={state.phone}
                onChange={handleInputChange}
                className={styles.formControl}
                style={{ marginBottom: 10 }}
              />
              <input
                type="text"
                name="address"
                placeholder="Địa chỉ giao hàng"
                value={state.address}
                onChange={handleInputChange}
                className={styles.formControl}
              />
            </div>*/}
          </div>

          <div className={styles.checkoutRow}>
            <div className={styles.checkoutColTitle}>Thông tin đơn hàng</div>
            <div className={styles.contentGroup}>
              <p className={styles.checkoutContentLabel}>Ghi chú đơn hàng</p>
              <textarea
                name="note"
                value={state.note}
                onChange={handleInputChange}
                className={styles.formControl}
                placeholder="Nhập ghi chú chung (ví dụ: giao giờ hành chính...)"
              ></textarea>
            </div>
          </div>
        </div>

        <div className={styles.checkoutColRight}>
          <div className={styles.checkoutRow}>
            <div className={styles.checkoutColTitle}>
              Đơn hàng của bạn ({selectedItems.length} sp)
            </div>
            <div className={styles.contentGroup}>
              <div className={styles.billTotal}>
                {selectedItems.length > 0 ? (
                  selectedItems.map((item) => (
                    <div className={styles.foodTotal} key={item.id}>
                      <span className={styles.count}>{item.quantity}x</span>
                      <div className={styles.infoFood}>
                        <p className={styles.nameFood}>
                          {item.productName || item.name}
                        </p>
                        {item.optionValuesDTO &&
                          item.optionValuesDTO.length > 0 && (
                            <p className={styles.foodOptions}>
                              {item.optionValuesDTO
                                .map((opt) => opt.value)
                                .join(", ")}
                            </p>
                          )}
                      </div>
                      <div className={styles.priceFood}>
                        {vnd(
                          (item.price || item.priceBase || 0) * item.quantity
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Vui lòng chọn sản phẩm trong giỏ hàng.</p>
                )}
              </div>
              <div className={styles.billPayment}>
                <div className={styles.priceFlx}>
                  <span>Tạm tính</span>
                  <span>{vnd(subTotal)}</span>
                </div>
                <div className={styles.priceFlx}>
                  <span>Phí giao hàng</span>
                  <span>{vnd(shippingFee)}</span>
                </div>
                <div className={styles.policyNote}>
                  Bằng việc bấm “Đặt hàng”, tôi đồng ý với{" "}
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    chính sách
                  </a>{" "}
                  của KHK Food.
                </div>
              </div>

              <div className={styles.paymentMethodSection}>
                <p className={styles.checkoutContentLabel}>
                  Phương thức thanh toán
                </p>
                <div className={styles.paymentBtnContainer}>
                  <button
                    className={`${styles.paymentBtn} ${
                      state.paymentMethod === "CASH" ? styles.active : ""
                    }`}
                    onClick={() =>
                      handlePaymentMethodChange({ target: { value: "CASH" } })
                    }
                  >
                    <i className="fa-regular fa-money-bill-1"></i>
                    <span>Tiền mặt</span>
                  </button>
                  <button
                    className={`${styles.paymentBtn} ${
                      state.paymentMethod === "VNPAY" ? styles.active : ""
                    }`}
                    onClick={() =>
                      handlePaymentMethodChange({ target: { value: "VNPAY" } })
                    }
                  >
                    <img
                      src={VnpayLogo}
                      alt="VNPay Logo"
                      className={styles.paymentLogoSvg}
                    />
                    <span>VNPAY</span>
                  </button>
                </div>
              </div>

              <div className={styles.totalCheckout}>
                <span>Tổng tiền</span>
                <span className={styles.priceFinal}>{vnd(finalTotal)}</span>
              </div>

              <button
                className={`${styles.completeCheckoutBtn} ${
                  selectedItems.length === 0 || isSubmitting
                    ? styles.disabled
                    : ""
                }`}
                onClick={onPlaceOrderClick}
                disabled={isSubmitting || selectedItems.length === 0}
              >
                {isSubmitting ? "Đang xử lý..." : "Đặt hàng"}
              </button>
            </div>
          </div>
        </div>
      </main>

      <VNPAYModal
        isOpen={isVnPayModalOpen}
        onClose={() => setIsVnPayModalOpen(false)}
        onConfirm={onVnPaySuccess}
        totalAmount={finalTotal}
      />
    </div>
  );
};

export default CheckoutPage;
