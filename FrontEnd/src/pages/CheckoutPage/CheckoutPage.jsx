import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartProvider";
import { useAuth } from "../../context/AuthContext";
import { useCheckoutForm } from "../../hooks/useCheckoutForm";
import DeliveryAddress from "../../components/DeliveryAddress/DeliveryAddress";
import styles from "./CheckoutPage.module.css";
import VNPAYModal from "./Modals/VNPAYModal";
import { useToast } from "../../context/ToastContext";
import { db } from "../../data/mockData";
import VnpayLogo from "../../assets/icon/vnpay_logo.svg";

// 1. Import useFilters để lấy storeId đang chọn
import { useFilters } from "../../context/FilterProvider";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, vnd, clearSelectedItems } = useCart();
  const { auth } = useAuth();
  const { showToast } = useToast();

  // 2. Lấy Store ID hiện tại từ Context
  const { filters } = useFilters();
  const currentStoreId = filters.storeId;

  const { state, handleInputChange, handlePaymentMethodChange } =
    useCheckoutForm(auth);

  const selectedItems = cartItems.filter((item) => item.selected);
  const subTotal = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingFee = 15000;
  const finalTotal = subTotal + shippingFee;

  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [isVnPayModalOpen, setIsVnPayModalOpen] = useState(false);

  // 3. Hàm sinh tọa độ ngẫu nhiên QUANH STORE HIỆN TẠI
  const getRandomLocation = () => {
    // Lấy thông tin store từ DB để lấy tọa độ gốc
    const currentStore = db.stores.getOne(currentStoreId);
    // Fallback về Quận 1 nếu không tìm thấy (đề phòng lỗi)
    const centerPos = currentStore?.location || [10.776019, 106.702068];

    const [lat, lng] = centerPos;
    const rLat = lat + (Math.random() - 0.5) * 0.06; // Bán kính ~3km
    const rLng = lng + (Math.random() - 0.5) * 0.06;
    return [rLat, rLng];
  };

  const createOrderData = () => {
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, 0)}:${now
      .getMinutes()
      .toString()
      .padStart(2, 0)} ${now.getDate()}/${
      now.getMonth() + 1
    }/${now.getFullYear()}`;

    // Lấy tên cửa hàng
    const currentStore = db.stores.getOne(currentStoreId);
    const storeName = currentStore ? currentStore.name : "KHK Food";

    return {
      id: Date.now(),
      orderTime: timeString,
      totalPrice: finalTotal,
      note: state.note,
      orderStatus: "PLACED",
      userId: auth ? auth.id : "GUEST",

      // [QUAN TRỌNG] Gán đúng Store ID và Tên Store
      restaurantId: currentStoreId,
      storeName: storeName,

      orderItems: selectedItems.map((item) => ({
        id: Date.now() + Math.random(),
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        imgUrl: item.imgUrl,
        note: item.note,
        productId: item.productId,
        optionValuesDTO: item.optionValuesDTO,
      })),
      deliveryInfo: {
        name: deliveryInfo.name,
        phone: deliveryInfo.phone,
        address: deliveryInfo.address,
        type: deliveryInfo.type,
      },
      paymentMethod: state.paymentMethod,
      droneId: null,

      // Tọa độ khách hàng (để Drone bay tới đúng chỗ)
      customerLocation: getRandomLocation(),
      customerAddress: deliveryInfo.address,
    };
  };

  const handleCheckoutClick = () => {
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

    if (state.paymentMethod === "VNPAY") {
      setIsVnPayModalOpen(true);
    } else {
      const newOrder = createOrderData();
      db.orders.add(newOrder);
      processOrderSuccess();
    }
  };

  const processOrderSuccess = () => {
    if (state.paymentMethod === "VNPAY") {
      const newOrder = createOrderData();
      db.orders.add(newOrder);
      setIsVnPayModalOpen(false);
    }

    clearSelectedItems();

    showToast({
      title: "Thành công",
      message: "Đặt hàng thành công! Cảm ơn bạn đã mua hàng.",
      type: "success",
    });

    setTimeout(() => {
      navigate("/");
    }, 1500);
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
                  selectedItems.length === 0 ? styles.disabled : ""
                }`}
                onClick={handleCheckoutClick}
              >
                Đặt hàng
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
