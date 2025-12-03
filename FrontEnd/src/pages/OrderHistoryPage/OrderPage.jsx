import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./OrderHistoryPage.module.css";
import ImageWithFallback from "../../components/ImageWithFallbackComponent/ImageWithFallback";
import Modal from "../../components/common/Modal";
import OrderDetailModal from "../../components/OrderDetailModal/OrderDetailModal";

// 1. IMPORT HOOKS & CONTEXT
import { useAuth } from "../../context/AuthContext";
// [QUAN TRỌNG] Thay db bằng service API
import orderService from "../../services/orderService";
import { useToast } from "../../context/ToastContext";
import { useFilters } from "../../context/FilterProvider";

// [CẬP NHẬT] Danh sách Status chuẩn theo Enum Backend
// Bạn có thể giữ nguyên iconClass cũ nếu muốn
const STATUSES = [
  { id: "ALL", label: "Tất cả", iconClass: "fas fa-list" },
  { id: "PLACED", label: "Chờ xác nhận", iconClass: "fas fa-hourglass-half" },
  { id: "CONFIRMED", label: "Đang lấy hàng", iconClass: "fas fa-box-open" },
  { id: "IN_PROGRESS", label: "Đang chế biến", iconClass: "fas fa-fire" }, // Mới
  { id: "READY_FOR_DELIVERY", label: "Chờ giao", iconClass: "fas fa-box" }, // Mới
  { id: "OUT_FOR_DELIVERY", label: "Đang giao", iconClass: "fas fa-truck" }, // Thay SHIPPING
  { id: "DELIVERED", label: "Đã giao", iconClass: "fas fa-check-circle" }, // Thay COMPLETED
  { id: "CANCELLED", label: "Đã huỷ", iconClass: "fas fa-ban" },
  { id: "REJECTED", label: "Đã từ chối", iconClass: "fas fa-times-circle" }, // Mới
  { id: "FAILED", label: "Thất bại", iconClass: "fas fa-exclamation-triangle" }, // Mới
];

const vnd = (amount) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount
  );

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const { auth: currentUser } = useAuth(); // Sửa auth -> currentUser để khớp code cũ
  const { showToast } = useToast();

  const { filters } = useFilters();
  const currentStoreId = filters.storeId;

  // Đặt mặc định là ALL để user thấy đơn hàng ngay
  const [activeStatus, setActiveStatus] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // [MỚI] State chứa danh sách đơn hàng từ API
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // Mặc định true để loading

  // --- 2. LẤY DỮ LIỆU TỪ API ---
  const fetchOrders = async () => {
    if (currentUser) {
      setLoading(true);
      try {
        // Gọi API lấy danh sách
        const data = await orderService.getMyOrders();
        setOrders(data || []);
      } catch (error) {
        console.error(error);
        // showToast({ title: "Lỗi", message: "Không thể tải đơn hàng", type: "error" });
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchOrders();
    } else {
      // Nếu chưa login, chuyển về login hoặc để trống
      setLoading(false);
    }
  }, [currentUser]);

  // --- 3. LỌC DỮ LIỆU (Client Side) ---
  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    let result = orders;

    // Lọc theo Store (nếu cần)
    if (currentStoreId && currentStoreId !== "null") {
      // result = result.filter(o => o.storeId == currentStoreId); // Tạm bỏ comment nếu muốn lọc
    }

    // Lọc theo Status
    if (activeStatus !== "ALL") {
      result = result.filter((o) => o.orderStatus === activeStatus);
    }

    // Sắp xếp mới nhất lên đầu
    return result.sort((a, b) => b.id - a.id);
  }, [orders, activeStatus, currentStoreId]);

  const handleViewDetails = (orderId) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrderId(null);
  };

  // Xử lý Hủy đơn
  const handleCancelOrder = async (orderId) => {
    if (window.confirm("Bạn có chắc muốn hủy đơn hàng này?")) {
      try {
        // Gọi API hủy (cần hàm updateStatus hoặc cancelOrder trong service)
        // Tạm thời giả định có hàm updateStatus
        // await orderService.updateStatus(orderId, "CANCELLED");

        // Hoặc nếu chưa có API, ta chỉ thông báo
        showToast({
          title: "Thông báo",
          message: "Tính năng đang cập nhật",
          type: "info",
        });

        // fetchOrders(); // Reload sau khi hủy
      } catch (error) {
        showToast({ title: "Lỗi", message: "Hủy đơn thất bại", type: "error" });
      }
    }
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
    // Cho phép hủy nếu mới đặt hoặc đã xác nhận
    const canCancel = ["PLACED", "CONFIRMED"].includes(order.orderStatus);

    return (
      <div className={styles.orderActions}>
        {canCancel && (
          <button
            className={styles.secondaryBtn}
            style={{
              marginRight: "10px",
              color: "#d32f2f",
              borderColor: "#d32f2f",
            }}
            onClick={(e) => {
              e.stopPropagation(); // Chặn click lan ra ngoài
              handleCancelOrder(order.id);
            }}
          >
            Hủy đơn
          </button>
        )}
        <button
          className={styles.secondaryBtn}
          onClick={() => handleViewDetails(order.id)}
        >
          Xem chi tiết
        </button>
        {/* Các nút khác tùy trạng thái */}
      </div>
    );
  };

  if (!currentUser) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Vui lòng đăng nhập.
      </div>
    );
  }

  return (
    <div className={styles.orderHistoryPage}>
      <header className={styles.orderHeader}>
        <div className={styles.orderReturn}>
          <button onClick={() => navigate(-1)}>
            <i className="fa-solid fa-chevron-left"></i>
          </button>
        </div>
        <h2 className={styles.orderTitle}>Lịch sử đơn hàng</h2>
      </header>

      <main className={styles.orderSection}>
        <div className={styles.orderRow}>
          <div className={styles.orderColTitle}>Trạng thái đơn hàng</div>
          <div className={styles.statusFilters}>
            {STATUSES.map((status) => (
              <button
                key={status.id}
                className={`${styles.statusBtn} ${
                  activeStatus === status.id ? styles.active : ""
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

          {loading ? (
            <div style={{ padding: "20px", textAlign: "center" }}>
              Đang tải dữ liệu...
            </div>
          ) : (
            <div className={styles.orderListContainer}>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const orderItems = order.orderItems || [];
                  const firstItem = orderItems[0];
                  const totalItems = orderItems.reduce(
                    (sum, p) => sum + p.quantity,
                    0
                  );
                  const totalPrice = order.totalPrice;

                  const statusInfo = STATUSES.find(
                    (s) => s.id === order.orderStatus
                  );
                  const isExpanded = expandedOrders.has(order.id);

                  // Nếu thu gọn, chỉ hiện 1 món. Nếu mở rộng, hiện hết.
                  const productsToShow = isExpanded
                    ? orderItems
                    : firstItem
                    ? [firstItem]
                    : [];

                  return (
                    <div key={order.id} className={styles.orderCard}>
                      <div className={styles.cardHeader}>
                        <span className={styles.orderId}>
                          Đơn hàng #{order.id}
                        </span>

                        {/* Map class CSS theo status. Nếu không có class tương ứng, dùng class default */}
                        <span
                          className={`${styles.statusTag} ${
                            styles[order.orderStatus?.toLowerCase()] ||
                            styles.placed
                          }`}
                        >
                          {statusInfo?.label || order.orderStatus}
                        </span>
                      </div>

                      <div className={styles.productList}>
                        {productsToShow.map((product, idx) => (
                          <div key={idx} className={styles.productRow}>
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
                              {/* Render Options nếu có */}
                              {product.optionValuesDTO &&
                                product.optionValuesDTO.length > 0 && (
                                  <p
                                    className={styles.productNote}
                                    style={{ fontSize: "13px", color: "#666" }}
                                  >
                                    {product.optionValuesDTO
                                      .map((o) => o.value)
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

                      {/* Nút Xem thêm / Thu gọn nếu có nhiều hơn 1 món */}
                      {orderItems.length > 1 && (
                        <div className={styles.toggleWrapper}>
                          <button
                            className={styles.toggleProductsBtn}
                            onClick={() => toggleOrderExpansion(order.id)}
                          >
                            <span>
                              {isExpanded
                                ? "Thu gọn"
                                : `Xem thêm ${orderItems.length - 1} món khác`}
                            </span>
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

                      <div className={styles.orderCardFooter}>
                        <ActionButtons order={order} />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className={`${styles.orderRow} ${styles.noOrders}`}>
                  <div
                    style={{
                      padding: "40px",
                      textAlign: "center",
                      color: "#999",
                    }}
                  >
                    <i
                      className="fa-light fa-box-open"
                      style={{ fontSize: "40px", marginBottom: "10px" }}
                    ></i>
                    <p>Không có đơn hàng nào.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <OrderDetailModalWrapper
          orderId={selectedOrderId}
          orders={orders}
          onClose={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

const OrderDetailModalWrapper = ({ orderId, orders, onClose }) => {
  const order = orders.find((o) => o.id === orderId);
  if (!order) return null;
  return <OrderDetailModal isOpen={true} onClose={onClose} order={order} />;
};

export default OrderHistoryPage;
