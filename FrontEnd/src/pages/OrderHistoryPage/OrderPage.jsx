import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./OrderHistoryPage.module.css";
import ImageWithFallback from "../../components/ImageWithFallbackComponent/ImageWithFallback";
import Modal from "../../components/common/Modal";
import OrderDetailModal from "../../components/OrderDetailModal/OrderDetailModal";

// 1. IMPORT HOOKS & CONTEXT
import { useAuth } from "../../context/AuthContext";
import { db } from "../../data/mockData";
// [MỚI] Import useFilters để lấy storeId đang chọn
import { useFilters } from "../../context/FilterProvider";

const STATUSES = [
  { id: "PLACED", label: "Chờ xác nhận", iconClass: "fas fa-hourglass-half" },
  { id: "CONFIRMED", label: "Đang lấy hàng", iconClass: "fas fa-box-open" },
  { id: "SHIPPING", label: "Đang vận chuyển", iconClass: "fas fa-truck" },
  { id: "COMPLETED", label: "Hoàn thành", iconClass: "fas fa-check-circle" },
  { id: "CANCELLED", label: "Đã huỷ", iconClass: "fas fa-ban" },
];

const vnd = (amount) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount
  );

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();

  // [MỚI] Lấy storeId hiện tại từ Filter Context
  const { filters } = useFilters();
  const currentStoreId = filters.storeId;

  const [activeStatus, setActiveStatus] = useState("PLACED");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // --- 2. LẤY & LỌC DỮ LIỆU ĐƠN HÀNG ---
  const displayedOrders = useMemo(() => {
    if (!auth) return [];

    let allOrders = db.orders.getAll();

    // 1. Lọc theo User ID hiện tại
    let userOrders = allOrders.filter((order) => order.userId === auth.id);

    // 2. [MỚI] Lọc theo Store ID hiện tại (Multi-store)
    if (currentStoreId) {
      userOrders = userOrders.filter(
        (order) => order.restaurantId === currentStoreId
      );
    }

    // 3. Lọc theo trạng thái đang chọn & Sắp xếp
    return userOrders
      .filter((order) => order.orderStatus === activeStatus)
      .sort((a, b) => b.id - a.id);
  }, [auth, activeStatus, currentStoreId]); // Thêm currentStoreId vào dependency

  // ... (Phần còn lại giữ nguyên như cũ) ...

  const handleViewDetails = (orderId) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrderId(null);
  };

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

  const ActionButtons = ({ order }) => {
    // ... (Code cũ giữ nguyên)
    switch (order.orderStatus) {
      case "PLACED":
      case "CONFIRMED":
        return (
          <div className={styles.orderActions}>
            <button
              onClick={() => handleViewDetails(order.id)}
              className={styles.secondaryBtn}
            >
              Xem chi tiết
            </button>
            {order.orderStatus === "PLACED" && (
              <button
                className={styles.primaryBtn}
                onClick={() => alert("Tính năng đang phát triển")}
              >
                Hủy đơn
              </button>
            )}
          </div>
        );
      case "SHIPPING":
        return (
          <div className={styles.orderActions}>
            <button
              onClick={() => handleViewDetails(order.id)}
              className={styles.secondaryBtn}
            >
              Xem chi tiết
            </button>
            <button className={styles.primaryBtn} disabled>
              Đang giao...
            </button>
          </div>
        );
      case "COMPLETED":
        return (
          <div className={styles.orderActions}>
            <button
              onClick={() => handleViewDetails(order.id)}
              className={styles.secondaryBtn}
            >
              Xem chi tiết
            </button>
            <button className={styles.primaryBtn}>Đánh giá</button>
          </div>
        );
      case "CANCELLED":
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
      default:
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

  if (!auth)
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Vui lòng đăng nhập để xem lịch sử.
      </div>
    );

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
        {/* Dòng thông báo Store hiện tại (Optional cho UX) */}
        {/* <div style={{padding: '10px 20px', fontSize: '14px', color: '#666'}}>
            Đang xem đơn hàng tại: <b>{db.stores.getOne(currentStoreId)?.name}</b>
        </div> */}

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

        <div className={styles.orderRow}>
          <div className={styles.orderColTitle}>
            Danh sách đơn hàng (
            {STATUSES.find((s) => s.id === activeStatus)?.label})
          </div>
          <div className={styles.orderListContainer}>
            {displayedOrders.length > 0 ? (
              displayedOrders.map((order) => {
                const totalItems = order.orderItems.reduce(
                  (sum, p) => sum + p.quantity,
                  0
                );
                const totalPrice = order.totalPrice;
                const statusInfo = STATUSES.find(
                  (s) => s.id === order.orderStatus
                );
                const isExpanded = expandedOrders.has(order.id);
                const productsToShow = isExpanded
                  ? order.orderItems
                  : order.orderItems.slice(0, 1);

                return (
                  <div key={order.id} className={styles.orderCard}>
                    <div className={styles.cardHeader}>
                      <span className={styles.orderId}>
                        Đơn hàng #{order.id}
                      </span>
                      <span
                        className={`${styles.statusTag} ${
                          styles[order.orderStatus?.toLowerCase()]
                        }`}
                      >
                        {statusInfo?.label || order.orderStatus}
                      </span>
                    </div>

                    <div className={styles.productList}>
                      {productsToShow.map((product) => (
                        <div key={product.id} className={styles.productRow}>
                          <ImageWithFallback
                            src={product.imgUrl}
                            alt={product.productName}
                            className={styles.productImage}
                          />
                          <div className={styles.productInfo}>
                            <p className={styles.productName}>
                              <span className={styles.productQuantity}>
                                {product.quantity}x
                              </span>{" "}
                              {product.productName}
                            </p>
                            {product.optionValuesDTO &&
                              product.optionValuesDTO.length > 0 && (
                                <p className={styles.productOptions}>
                                  {product.optionValuesDTO
                                    .map((opt) => opt.value)
                                    .join(", ")}
                                </p>
                              )}
                          </div>
                          <div className={styles.productPrice}>
                            {vnd(product.price * product.quantity)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {order.orderItems.length > 1 && (
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
                <p>Không có đơn hàng nào tại cửa hàng này.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <OrderDetailModalWrapper
          orderId={selectedOrderId}
          onClose={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

const OrderDetailModalWrapper = ({ orderId, onClose }) => {
  const order = db.orders.getAll().find((o) => o.id === orderId);
  if (!order) return null;
  return <OrderDetailModal isOpen={true} onClose={onClose} order={order} />;
};

export default OrderHistoryPage;
