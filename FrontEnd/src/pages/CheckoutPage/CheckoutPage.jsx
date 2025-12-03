import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartProvider";
import { useAuth } from "../../context/AuthContext";
import { useCheckoutForm } from "../../hooks/useCheckoutForm";
import DeliveryAddress from "../../components/DeliveryAddress/DeliveryAddress";
import styles from "./CheckoutPage.module.css";
import VNPAYModal from "./Modals/VNPAYModal";
import { useToast } from "../../context/ToastContext";
// Vẫn giữ import db để tránh lỗi nếu bạn có dùng biến db ở đâu đó, nhưng logic order không dùng nữa
import { db } from "../../data/mockData";
import VnpayLogo from "../../assets/icon/vnpay_logo.svg";

// 1. Import useFilters để lấy storeId đang chọn
import { useFilters, useStores } from "../../context/FilterProvider";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, vnd, clearSelectedItems } = useCart();
  const { auth } = useAuth();
  const { showToast } = useToast();

  // 2. Lấy Store ID hiện tại từ Context
  const { filters } = useFilters();
  const { data: stores = [] } = useStores();

  // Lấy handlePlaceOrder từ hook
  const {
    state,
    handleInputChange,
    handlePaymentMethodChange,
    handlePlaceOrder,
    loading,
  } = useCheckoutForm();

  const selectedItems = cartItems.filter((item) => item.selected);
  const subTotal = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingFee = 15000;
  const finalTotal = subTotal + shippingFee;

  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [isVnPayModalOpen, setIsVnPayModalOpen] = useState(false);

  // [LOGIC QUAN TRỌNG] Xác định Store ID chắc chắn nhất
  const getTargetStoreId = () => {
    // 1. Ưu tiên: Lấy từ món hàng trong giỏ (Chính xác nhất nếu giỏ hàng có lưu storeId)
    if (selectedItems.length > 0 && selectedItems[0].storeId) {
      return selectedItems[0].storeId;
    }

    // 2. Thứ hai: Lấy từ filter hiện tại (nếu user chọn trên header)
    if (filters.storeId) {
      return filters.storeId;
    }

    // 3. [MỚI] Cuối cùng: Lấy cửa hàng đầu tiên trong danh sách (Fallback)
    // Giống logic Header: Nếu chưa chọn gì thì mặc định quán đầu tiên
    if (stores.length > 0) {
      return stores[0].id;
    }

    return null;
  };

  // [ĐÃ XÓA] Các hàm getRandomLocation, createOrderData (Logic cũ Mock)

  const handleCheckoutClick = async () => {
    if (selectedItems.length === 0) {
      showToast({
        title: "Thông báo",
        message: "Vui lòng chọn sản phẩm!",
        type: "warning",
      });
      return;
    }

    if (!deliveryInfo) {
      showToast({
        title: "Lỗi",
        message: "Vui lòng chọn địa chỉ nhận hàng",
        type: "error",
      });
      return;
    }

    const targetStoreId = getTargetStoreId();

    if (!targetStoreId) {
      showToast({
        title: "Lỗi",
        message: "Không xác định được cửa hàng. Vui lòng thử lại.",
        type: "error",
      });
      return;
    }

    if (state.paymentMethod === "VNPAY") {
      setIsVnPayModalOpen(true);
    } else {
      // Gọi API tạo đơn
      await handlePlaceOrder(deliveryInfo, targetStoreId, false);
    }
  };

  const processOrderSuccess = async () => {
    setIsVnPayModalOpen(false);
    const targetStoreId = getTargetStoreId();
    // Gọi API tạo đơn (đã thanh toán)
    await handlePlaceOrder(deliveryInfo, targetStoreId, true);
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
            <DeliveryAddress onAddressChange={setDeliveryInfo} />
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
                        <p className={styles.nameFood}>{item.productName}</p>
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
                        {vnd(item.price * item.quantity)}
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
                  selectedItems.length === 0 || loading ? styles.disabled : ""
                }`}
                onClick={handleCheckoutClick}
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : "Đặt hàng"}
              </button>
            </div>
          </div>
        </div>
      </main>
      <VNPAYModal
        isOpen={isVnPayModalOpen}
        onClose={() => setIsVnPayModalOpen(false)}
        onConfirm={processOrderSuccess}
        totalAmount={finalTotal}
      />
    </div>
  );
};

export default CheckoutPage;
