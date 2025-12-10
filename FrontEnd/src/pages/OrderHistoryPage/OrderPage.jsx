// src/pages/OrderHistoryPage/OrderHistoryPage.jsx
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import styles from "./OrderHistoryPage.module.css";
import ImageWithFallback from "../../components/ImageWithFallbackComponent/ImageWithFallback";
import Modal from "../../components/common/Modal";
import OrderDetailModal from "../../components/OrderDetailModal/OrderDetailModal";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../services/dbService";
import { useFilters } from "../../context/FilterProvider";

// [CẬP NHẬT] Danh sách Tab trạng thái
const STATUS_TABS = [
  { id: "PLACED", label: "Chờ xác nhận", iconClass: "fas fa-hourglass-half" },
  { id: "PROCESSING", label: "Đang xử lý", iconClass: "fas fa-box-open" }, // Gộp CONFIRMED + PICKING
  { id: "SHIPPING", label: "Đang giao", iconClass: "fas fa-truck" },
  { id: "COMPLETED", label: "Hoàn thành", iconClass: "fas fa-check-circle" },
  { id: "CANCELLED", label: "Đã huỷ", iconClass: "fas fa-ban" },
];

// Helper để hiển thị Label đẹp hơn cho từng status cụ thể trong Card
const getStatusLabel = (status) => {
  switch (status) {
    case "PLACED":
      return "Chờ xác nhận";
    case "CONFIRMED":
      return "Đã xác nhận";
    case "PICKING":
      return "Drone đang lấy hàng"; // Label chi tiết
    case "SHIPPING":
      return "Đang bay giao khách";
    case "COMPLETED":
      return "Giao thành công";
    case "CANCELLED":
      return "Đã hủy";
    default:
      return status;
  }
};

const vnd = (amount) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount
  );

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { filters } = useFilters();
  const currentStoreId = filters.storeId;

  const [activeTab, setActiveTab] = useState("PLACED"); // State quản lý Tab đang chọn
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const { data: allOrders = [], isLoading } = useQuery({
    queryKey: ["myOrders", auth?.id],
    queryFn: async () => {
      if (!auth?.id) return [];
      return await db.orders.getAll();
    },
    enabled: !!auth?.id,
    staleTime: 0,
  });

  // --- [SỬA QUAN TRỌNG] LOGIC LỌC GỘP TRẠNG THÁI ---
  const displayedOrders = useMemo(() => {
    if (!auth) return [];

    let userOrders = allOrders.filter((order) => order.userId === auth.id);

    if (currentStoreId) {
      userOrders = userOrders.filter(
        (order) => order.restaurantId === currentStoreId
      );
    }

    // Lọc theo Tab đang chọn
    return userOrders
      .filter((order) => {
        const status = order.orderStatus;
        switch (activeTab) {
          case "PLACED":
            return status === "PLACED";
          case "PROCESSING":
            // [QUAN TRỌNG] Tab này hiện cả CONFIRMED và PICKING
            return status === "CONFIRMED" || status === "PICKING";
          case "SHIPPING":
            return status === "SHIPPING";
          case "COMPLETED":
            return status === "COMPLETED";
          case "CANCELLED":
            return status === "CANCELLED";
          default:
            return true;
        }
      })
      .sort((a, b) => {
        // Sắp xếp đơn mới nhất lên đầu (dựa vào ID hoặc OrderTime)
        // Vì ID là string dạng số tăng dần, ta có thể parse hoặc compare string
        return b.id - a.id;
      });
  }, [auth, activeTab, currentStoreId, allOrders]);

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
      if (newExpanded.has(orderId)) newExpanded.delete(orderId);
      else newExpanded.add(orderId);
      return newExpanded;
    });
  };

  // Render nút bấm hành động tương ứng
  const ActionButtons = ({ order }) => {
    // Logic nút bấm đơn giản hóa
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
            onClick={() => alert("Chức năng đang phát triển")}
          >
            Hủy đơn
          </button>
        )}

        {order.orderStatus === "COMPLETED" && (
          <button className={styles.primaryBtn}>Đánh giá</button>
        )}

        {order.orderStatus === "CANCELLED" && (
          <button className={styles.primaryBtn}>Mua lại</button>
        )}
      </div>
    );
  };

  if (!auth)
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Vui lòng đăng nhập.
      </div>
    );
  if (isLoading)
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Đang tải đơn hàng...
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
        {/* Render danh sách Tab */}
        <div className={styles.orderRow}>
          <div className={styles.orderColTitle}>Trạng thái đơn hàng</div>
          <div className={styles.statusFilters}>
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.statusBtn} ${
                  tab.id === activeTab ? styles.active : ""
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <i className={tab.iconClass}></i>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Danh sách đơn hàng */}
        <div className={styles.orderRow}>
          <div className={styles.orderColTitle}>
            Danh sách đơn hàng (
            {STATUS_TABS.find((s) => s.id === activeTab)?.label})
          </div>
          <div className={styles.orderListContainer}>
            {displayedOrders.length > 0 ? (
              displayedOrders.map((order) => {
                const totalItems = order.orderItems.reduce(
                  (sum, p) => sum + p.quantity,
                  0
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
                      {/* Hiển thị Label chi tiết (Vd: Drone đang lấy hàng) */}
                      <span
                        className={`${styles.statusTag} ${
                          styles[order.orderStatus?.toLowerCase()] || ""
                        }`}
                      >
                        {getStatusLabel(order.orderStatus)}
                      </span>
                    </div>

                    <div className={styles.productList}>
                      {productsToShow.map((product) => (
                        <div
                          key={product.id || Math.random()}
                          className={styles.productRow}
                        >
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
                            {product.optionValuesDTO?.length > 0 && (
                              <p className={styles.productOptions}>
                                {product.optionValuesDTO
                                  .map((opt) => opt.value)
                                  .join(", ")}
                              </p>
                            )}
                          </div>
                          <div className={styles.productPrice}>
                            {vnd((product.price || 0) * product.quantity)}
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
                          {vnd(order.totalPrice)}
                        </span>
                      </span>
                    </div>

                    <ActionButtons order={order} />
                  </div>
                );
              })
            ) : (
              <div className={`${styles.orderRow} ${styles.noOrders}`}>
                <p>Không có đơn hàng nào ở trạng thái này.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {selectedOrderId && (
          <OrderDetailModalWrapper
            orderId={selectedOrderId}
            allOrders={allOrders}
            onClose={handleCloseModal}
          />
        )}
      </Modal>
    </div>
  );
};

const OrderDetailModalWrapper = ({ orderId, allOrders, onClose }) => {
  const order = allOrders.find((o) => o.id === orderId);
  if (!order) return null;
  return <OrderDetailModal order={order} onClose={onClose} />;
};

export default OrderHistoryPage;
