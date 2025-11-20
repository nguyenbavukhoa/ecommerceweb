import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./OrderHistoryPage.module.css";
import ImageWithFallback from "../../components/ImageWithFallbackComponent/ImageWithFallback";
import Modal from "../../components/common/Modal"; // Import Modal chung
import OrderDetailModal from "../../components/OrderDetailModal/OrderDetailModal"; // Import Modal chi tiết
import { ALL_ORDERS } from "../../data/mockData";
// --- DỮ LIỆU TRẠNG THÁI ---
const STATUSES = [
  { id: "pending", label: "Chờ xác nhận", iconClass: "fas fa-hourglass-half" },
  { id: "picking", label: "Đang lấy hàng", iconClass: "fas fa-box-open" },
  { id: "shipping", label: "Đang vận chuyển", iconClass: "fas fa-truck" },
  { id: "delivered", label: "Đã giao", iconClass: "fas fa-check-circle" },
  { id: "returned", label: "Hoàn trả", iconClass: "fas fa-undo-alt" },
  { id: "cancelled", label: "Đã huỷ", iconClass: "fas fa-ban" },
];

// Helper function để định dạng tiền tệ
const vnd = (amount) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount
  );

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const [activeStatus, setActiveStatus] = useState("pending");
  const [displayedOrders, setDisplayedOrders] = useState([]);

  // --- STATE ĐỂ ĐIỀU KHIỂN MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // STATE: Dùng Set để lưu ID của các đơn hàng đang được mở rộng
  const [expandedOrders, setExpandedOrders] = useState(new Set());

  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    const filteredOrders = ALL_ORDERS.filter(
      (order) => order.status === activeStatus
    );
    setDisplayedOrders(filteredOrders);
  }, [activeStatus]);

  // --- HÀM ĐỂ MỞ MODAL ---
  const handleViewDetails = (orderId) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrderId(null);
  };

  // HÀM Để bật/tắt trạng thái mở rộng của một đơn hàng
  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders((prevExpanded) => {
      const newExpanded = new Set(prevExpanded);
      if (newExpanded.has(orderId)) {
        newExpanded.delete(orderId);
      } else {
        newExpanded.add(orderId);
      }
      return newExpanded;
    });
  };

  // Function component để hiển thị các nút hành động dựa trên trạng thái đơn hàng
  const ActionButtons = ({ order }) => {
    const isRefundable = () => {
      if (!order.deliveredAt) return false;
      const deliveredTime = new Date(order.deliveredAt).getTime();
      const oneHourAgo = Date.now() - 60 * 60 * 1000;
      return deliveredTime > oneHourAgo;
    };

    // Sử dụng switch case cho dễ đọc hơn
    switch (order.status) {
      case "pending":
      case "picking":
        return (
          <div className={styles.orderActions}>
            <button
              onClick={() => handleViewDetails(order.id)}
              className={styles.secondaryBtn}
            >
              Xem chi tiết
            </button>
            <button className={styles.primaryBtn}>Hủy đơn</button>
          </div>
        );

      case "shipping":
        return (
          <div className={styles.orderActions}>
            <button
              onClick={() => handleViewDetails(order.id)}
              className={styles.secondaryBtn}
            >
              Xem chi tiết
            </button>
            <button className={styles.secondaryBtn}>Hoàn tiền</button>
            <button className={styles.primaryBtn}>Đã nhận hàng</button>
          </div>
        );

      case "delivered":
        return (
          <div className={styles.orderActions}>
            <button
              onClick={() => handleViewDetails(order.id)}
              className={styles.secondaryBtn}
            >
              Xem chi tiết
            </button>
            <button
              className={styles.secondaryBtn}
              disabled={!isRefundable()}
              title={
                !isRefundable()
                  ? "Chỉ được hoàn trả trong 1 giờ sau khi nhận"
                  : ""
              }
            >
              Hoàn tiền
            </button>
            <button className={styles.primaryBtn}>Đánh giá</button>
          </div>
        );

      case "cancelled":
        return (
          <div className={styles.orderActions}>
            <button
              onClick={() => handleViewDetails(order.id)}
              className={styles.secondaryBtn}
            >
              Xem chi tiết
            </button>
            <button className={styles.primaryBtn}>Mua lại</button>
          </div>
        );

      default: // Các trạng thái còn lại như 'returned'
        return (
          <div className={styles.orderActions}>
            <button
              onClick={() => handleViewDetails(order.id)}
              className={styles.secondaryBtn}
            >
              Xem chi tiết
            </button>
          </div>
        );
    }
  };

  return (
    <div
      className={`${styles.orderHistoryPage} ${
        isModalOpen ? styles.modalActive : ""
      }`}
    >
      <header className={styles.orderHeader}>
        <div className={styles.orderReturn}>
          <button onClick={() => navigate(-1)}>
            <i className="fa-solid fa-chevron-left"></i>
          </button>
        </div>
        <h2 className={styles.orderTitle}>Lịch sử đơn hàng</h2>
      </header>

      <main className={styles.orderSection}>
        {/* === DÒNG 1: KHU VỰC LỌC TRẠNG THÁI === */}
        <div className={styles.orderRow}>
          <div className={styles.orderColTitle}>Trạng thái đơn hàng</div>
          <div className={styles.statusFilters}>
            {STATUSES.map((status) => (
              <button
                key={status.id}
                className={`${styles.statusBtn} ${
                  status.id === activeStatus ? styles.active : ""
                }`}
                onClick={() => setActiveStatus(status.id)}
              >
                <i className={status.iconClass}></i>
                <span>{status.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* === DÒNG 2: KHU VỰC DANH SÁCH ĐƠN HÀNG === */}
        <div className={styles.orderRow}>
          <div className={styles.orderColTitle}>
            Danh sách đơn hàng (
            {STATUSES.find((s) => s.id === activeStatus)?.label})
          </div>
          <div className={styles.orderListContainer}>
            {displayedOrders.length > 0 ? (
              displayedOrders.map((order) => {
                const totalItems = order.products.reduce(
                  (sum, p) => sum + p.quantity,
                  0
                );
                const totalPrice = order.products.reduce(
                  (sum, p) => sum + p.price * p.quantity,
                  0
                );
                const statusInfo = STATUSES.find((s) => s.id === order.status);

                // LOGIC MỚI: Quyết định xem có mở rộng list không và hiển thị sản phẩm tương ứng
                const isExpanded = expandedOrders.has(order.id);
                const productsToShow = isExpanded
                  ? order.products
                  : order.products.slice(0, 1);

                return (
                  <div key={order.id} className={styles.orderCard}>
                    <div className={styles.cardHeader}>
                      <span className={styles.orderId}>
                        Đơn hàng #{order.id}
                      </span>
                      <span
                        className={`${styles.statusTag} ${
                          styles[order.status]
                        }`}
                      >
                        {statusInfo?.label}
                      </span>
                    </div>

                    <div className={styles.productList}>
                      {productsToShow.map((product) => (
                        <div key={product.id} className={styles.productRow}>
                          <ImageWithFallback
                            src={product.image}
                            alt={product.name}
                            className={styles.productImage}
                          />
                          <div className={styles.productInfo}>
                            <p className={styles.productName}>
                              <span className={styles.productQuantity}>
                                {product.quantity}x
                              </span>{" "}
                              {product.name}
                            </p>
                            {product.options && (
                              <p className={styles.productOptions}>
                                {product.options}
                              </p>
                            )}
                          </div>
                          <div className={styles.productPrice}>
                            {vnd(product.price * product.quantity)}
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* NÚT MỚI: Chỉ hiển thị nút "Xem thêm" nếu đơn hàng có nhiều hơn 1 sản phẩm */}
                    {order.products.length > 1 && (
                      <div className={styles.toggleWrapper}>
                        <button
                          className={styles.toggleProductsBtn}
                          onClick={() => toggleOrderExpansion(order.id)}
                        >
                          <span>{isExpanded ? "Thu gọn" : "Xem thêm"}</span>
                          <i
                            className={`fa-solid ${
                              isExpanded ? "fa-chevron-up" : "fa-chevron-down"
                            }`}
                          ></i>
                        </button>
                      </div>
                    )}

                    <div className={styles.orderSummary}>
                      <span>{totalItems} sản phẩm</span>
                      <span>
                        Thành tiền:{" "}
                        <span className={styles.totalPrice}>
                          {vnd(totalPrice)}
                        </span>
                      </span>
                    </div>

                    <ActionButtons order={order} />
                  </div>
                );
              })
            ) : (
              <div className={`${styles.orderRow} ${styles.noOrders}`}>
                <div className={styles.orderColTitle}>
                  {STATUSES.find((s) => s.id === activeStatus)?.label}
                </div>
                <p>Không có đơn hàng nào.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      {/* --- RENDER MODAL Ở ĐÂY --- */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <OrderDetailModal
          orderId={selectedOrderId}
          onClose={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

export default OrderHistoryPage;
