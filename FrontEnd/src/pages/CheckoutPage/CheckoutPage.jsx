import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartProvider";
import { useAuth } from "../../context/AuthContext";
import { useCheckoutForm } from "../../hooks/useCheckoutForm";
import DeliveryAddress from "../../components/DeliveryAddress/DeliveryAddress";
import styles from "./CheckoutPage.module.css";
// Import file SVG như một React Component
import { ReactComponent as VnpayLogo } from "../../assets/icon/vnpay_logo.svg";
const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, vnd } = useCart();
  const { auth } = useAuth();
  const {
    state,
    handleInputChange,
    handlePaymentMethodChange,
    handleDeliveryTypeChange,
    handleDateChange,
    handleDeliveryOptionChange,
    handleTimeChange,
    handleBranchChange,
    handlePlaceOrder,
    dateOptions,
    timeOptions,
  } = useCheckoutForm(auth);

  const selectedItems = cartItems.filter((item) => item.selected);
  const subTotal = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingFee =
    subTotal > 0 && state.deliveryType === "delivery" ? 15000 : 0;
  const finalTotal = subTotal + shippingFee;

  // State để nhận thông tin địa chỉ
  const [deliveryInfo, setDeliveryInfo] = useState(null); // State to receive selected address

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
        {/* --- CỘT BÊN TRÁI --- */}
        <div className={styles.checkoutColLeft}>
          {/* Thông tin người nhận */}
          <div className={styles.checkoutRow}>
            <div className={styles.checkoutColTitle}>Thông tin người nhận</div>
            <DeliveryAddress onAddressChange={setDeliveryInfo} />
          </div>
          <div className={styles.checkoutRow}>
            <div className={styles.checkoutColTitle}>Thông tin đơn hàng</div>
            <div className={styles.contentGroup}>
              <p className={styles.checkoutContentLabel}>Hình thức giao nhận</p>
              <div className={styles.checkoutTypeOrder}>
                <button
                  className={`${styles.typeOrderBtn} ${
                    state.deliveryType === "delivery" ? styles.active : ""
                  }`}
                  onClick={() => handleDeliveryTypeChange("delivery")}
                >
                  <i
                    className="fa-duotone fa-moped"
                    style={{
                      "--fa-secondary-opacity": "1.0",
                      "--fa-primary-color": "dodgerblue",
                      "--fa-secondary-color": "#ffb100",
                    }}
                  ></i>
                  Giao tận nơi
                </button>
                <button
                  className={`${styles.typeOrderBtn} ${
                    state.deliveryType === "pickup" ? styles.active : ""
                  }`}
                  onClick={() => handleDeliveryTypeChange("pickup")}
                >
                  <i
                    class="fa-duotone fa-box-heart"
                    style={{
                      "--fa-secondary-opacity": "1.0",
                      "--fa-primary-color": "pink",
                      "--fa-secondary-color": "palevioletred",
                    }}
                  ></i>
                  Tự đến lấy
                </button>
              </div>
            </div>
            <div className={styles.contentGroup}>
              <p className={styles.checkoutContentLabel}>Ngày giao hàng</p>
              <div className={styles.dateOrder}>
                {dateOptions.map((opt) => (
                  <a
                    key={opt.value}
                    href="#!"
                    className={`${styles.pickDate} ${
                      state.deliveryDate === opt.value ? styles.active : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleDateChange(opt.value);
                    }}
                  >
                    <span className={styles.text}>{opt.text}</span>
                    <span className={styles.date}>{opt.date}</span>
                  </a>
                ))}
              </div>
            </div>
            {state.deliveryType === "delivery" && (
              <div className={styles.contentGroup}>
                <p className={styles.checkoutContentLabel}>
                  Thời gian giao hàng
                </p>
                <div className={styles.deliveryTime}>
                  <input
                    type="radio"
                    name="deliveryOption"
                    id="giaongay"
                    value="now"
                    checked={state.deliveryOption === "now"}
                    onChange={handleDeliveryOptionChange}
                  />
                  <label htmlFor="giaongay">Giao ngay khi xong</label>
                </div>
                <div className={styles.deliveryTime}>
                  <input
                    type="radio"
                    name="deliveryOption"
                    id="deliverytime"
                    value="schedule"
                    checked={state.deliveryOption === "schedule"}
                    onChange={handleDeliveryOptionChange}
                  />
                  <label htmlFor="deliverytime">Giao vào giờ</label>
                  <select
                    className={styles.choiseTime}
                    value={state.deliveryTime}
                    onChange={handleTimeChange}
                    disabled={state.deliveryOption !== "schedule"}
                  >
                    {timeOptions.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            {state.deliveryType === "pickup" && (
              <div className={styles.contentGroup}>
                <p className={styles.checkoutContentLabel}>
                  Lấy hàng tại chi nhánh
                </p>
                <div className={styles.deliveryTime}>
                  <input
                    type="radio"
                    name="pickupBranch"
                    id="chinhanh-1"
                    value="chinhanh-1"
                    checked={state.pickupBranch === "chinhanh-1"}
                    onChange={handleBranchChange}
                  />
                  <label htmlFor="chinhanh-1">
                    273 An Dương Vương, P.3, Q.5
                  </label>
                </div>
                <div className={styles.deliveryTime}>
                  <input
                    type="radio"
                    name="pickupBranch"
                    id="chinhanh-2"
                    value="chinhanh-2"
                    checked={state.pickupBranch === "chinhanh-2"}
                    onChange={handleBranchChange}
                  />
                  <label htmlFor="chinhanh-2">
                    04 Tôn Đức Thắng, P.Bến Nghé, Q.1
                  </label>
                </div>
              </div>
            )}
            <div className={styles.contentGroup}>
              <p className={styles.checkoutContentLabel}>Ghi chú đơn hàng</p>
              <textarea
                name="note"
                value={state.note}
                onChange={handleInputChange}
                className={styles.formControl}
                placeholder="Nhập ghi chú chung..."
              ></textarea>
            </div>
          </div>
        </div>

        {/* --- CỘT BÊN PHẢI --- */}
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
                        {/* 👇 THÊM PHẦN HIỂN THỊ TÙY CHỌN Ở ĐÂY */}
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

              {/* PHẦN CHỌN PHƯƠNG THỨC THANH TOÁN TẠI ĐÂY */}
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
                    <VnpayLogo className={styles.paymentLogoSvg} />
                    <span>VNPAY</span>
                  </button>
                </div>
              </div>
              {/* KẾT THÚC PHẦN CHỌN PHƯƠNG THỨC THANH TOÁN */}

              <div className={styles.totalCheckout}>
                <span>Tổng tiền</span>
                <span className={styles.priceFinal}>{vnd(finalTotal)}</span>
              </div>
              <button
                className={`${styles.completeCheckoutBtn} ${
                  selectedItems.length === 0 ? styles.disabled : ""
                }`}
                onClick={() => handlePlaceOrder(selectedItems, finalTotal)}
              >
                Đặt hàng
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
