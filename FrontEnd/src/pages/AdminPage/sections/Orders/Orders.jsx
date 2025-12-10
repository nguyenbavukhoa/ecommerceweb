import React, { useState, useMemo, useEffect } from "react";
import { useToast } from "../../../../context/ToastContext";
import styles from "./Orders.module.scss";
import { vnd } from "../../utils";

import { useAuth } from "../../../../context/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import orderService from "../../../../services/orderService";
import deliveryService from "../../../../services/deliveryService";
import droneService from "../../../../services/droneService";

// COMPONENTS
import OrderDetailModal from "../../components/Modals/OrderDetailModal"; // [NOTE] Đổi tên import cho khớp file
import DroneMap from "./../DroneMap/DroneMap";

const ORDER_STATUSES = [
  { value: "PLACED", label: "Mới đặt" },
  { value: "CONFIRMED", label: "Đã xác nhận" },
  { value: "IN_PROGRESS", label: "Đang chế biến" },
  { value: "READY_FOR_DELIVERY", label: "Chờ giao hàng" },
  { value: "OUT_FOR_DELIVERY", label: "Đang giao hàng" },
  { value: "DELIVERED", label: "Hoàn thành" },
  { value: "CANCELLED", label: "Đã hủy" },
  { value: "REJECTED", label: "Đã từ chối" },
  { value: "FAILED", label: "Thất bại" },
];

const Orders = ({ storeId }) => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const currentStoreId = storeId || user?.storeId || 1;

  const [viewMode, setViewMode] = useState("LIST");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  // 1. FETCH ALL DATA
  const { data: allOrders = [], isLoading } = useQuery({
    queryKey: ["adminAllOrders", currentStoreId],
    queryFn: async () => {
      if (!currentStoreId) return [];
      return await orderService.getAllStoreOrders(currentStoreId);
    },
    refetchInterval: 5000,
    enabled: !!currentStoreId,
  });

  // 2. STATS
  const stats = useMemo(
    () => ({
      all: allOrders.length,
      new: allOrders.filter((o) => o.orderStatus === "PLACED").length,
      cooking: allOrders.filter((o) =>
        ["IN_PROGRESS", "CONFIRMED"].includes(o.orderStatus)
      ).length,
      ready: allOrders.filter((o) => o.orderStatus === "READY_FOR_DELIVERY")
        .length,
      shipping: allOrders.filter((o) => o.orderStatus === "OUT_FOR_DELIVERY")
        .length,
    }),
    [allOrders]
  );

  // 3. FILTER
  const filteredOrders = useMemo(() => {
    let result = [...allOrders];
    if (statusFilter !== "ALL")
      result = result.filter((o) => o.orderStatus === statusFilter);
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(
        (o) =>
          o.id.toString().includes(lower) ||
          (o.note && o.note.toLowerCase().includes(lower))
      );
    }
    return result.sort((a, b) => b.id - a.id); // Mới nhất lên đầu
  }, [allOrders, statusFilter, searchTerm]);

  // 4. PAGINATION
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const displayedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchTerm]);

  // --- HANDLERS ---
  const handleQuickStatus = async (orderId, nextStatus) => {
    setProcessingId(orderId);
    try {
      await orderService.updateStatus(orderId, nextStatus);
      await queryClient.invalidateQueries({ queryKey: ["adminAllOrders"] });
      showToast({
        title: "Thành công",
        message: "Đã cập nhật trạng thái!",
        type: "success",
      });
    } catch (err) {
      showToast({ title: "Lỗi", message: "Thao tác thất bại", type: "error" });
    } finally {
      setProcessingId(null);
    }
  };

  const handleQuickDispatch = async (order) => {
    setProcessingId(order.id);
    try {
      // B1: Tìm Drone rảnh
      const candidates = await droneService.getCandidateDrones(
        15,
        currentStoreId
      );

      if (!candidates || candidates.length === 0) {
        showToast({
          title: "Hết Drone",
          message: "Hiện không có Drone nào rảnh!",
          type: "warning",
        });
        setProcessingId(null);
        return;
      }

      const selectedDrone = candidates[0];

      // B2: Tạo Delivery
      const res = await deliveryService.createDelivery(
        order.id,
        selectedDrone.id
      );

      // B3: Refresh toàn bộ dữ liệu (List sẽ tự cập nhật status sang OUT_FOR_DELIVERY)
      await queryClient.invalidateQueries({ queryKey: ["adminAllOrders"] });
      await queryClient.invalidateQueries({ queryKey: ["drones"] });

      showToast({
        title: "Đã gọi Drone",
        message: `Drone ${selectedDrone.serial} đang đến lấy hàng!`,
        type: "success",
      });

      // B4: Mở Modal (Truyền order đã update giả lập để User thấy ngay sự thay đổi)
      const updatedOrder = {
        ...order,
        orderStatus: "OUT_FOR_DELIVERY",
        droneId: selectedDrone.id,
        deliveryId: res.data?.id || res.id,
      };
      openDetailModal(updatedOrder);
    } catch (err) {
      console.error(err);
      showToast({
        title: "Thất bại",
        message: "Không thể điều phối Drone lúc này.",
        type: "error",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const openDetailModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handlePageChange = (p) => {
    if (p >= 1 && p <= totalPages) setCurrentPage(p);
  };

  const renderTime = (timeStr) => {
    if (!timeStr) return <span>---</span>;
    // Xử lý format thời gian đơn giản
    const dateObj = new Date(timeStr);
    const time = dateObj.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const date = dateObj.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    });

    return (
      <div className={styles.dateTimeCell}>
        <span className={styles.time}>{time}</span>
        <span className={styles.date}>{date}</span>
      </div>
    );
  };

  return (
    <>
      <div className={styles.section}>
        <div className={styles.adminControl}>
          <div className={styles.viewSwitcher}>
            <button
              className={`${styles.switchBtn} ${
                viewMode === "LIST" ? styles.active : ""
              }`}
              onClick={() => setViewMode("LIST")}
            >
              <i className="fa-solid fa-list-check"></i> Quản lý & Bếp
            </button>
            <button
              className={`${styles.switchBtn} ${
                viewMode === "MAP" ? styles.active : ""
              }`}
              onClick={() => setViewMode("MAP")}
            >
              <i className="fa-solid fa-map-location-dot"></i> Bản đồ Drone
            </button>
          </div>

          {viewMode === "LIST" && (
            <div className={styles.searchWrapper}>
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                placeholder="Tìm mã đơn, ghi chú..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className={styles.contentBody}>
          {viewMode === "LIST" ? (
            <>
              {/* STATS BAR */}
              <div className={styles.statsBar}>
                <div
                  className={`${styles.statCard} ${
                    statusFilter === "ALL" ? styles.active : ""
                  }`}
                  onClick={() => setStatusFilter("ALL")}
                >
                  <div className={styles.statInfo}>
                    <span className={styles.label}>Tổng đơn</span>
                    <h4 className={styles.count}>{stats.all}</h4>
                  </div>
                  <div className={styles.statIcon}>
                    <i className="fa-solid fa-clipboard-list"></i>
                  </div>
                </div>
                <div
                  className={`${styles.statCard} ${styles.new} ${
                    statusFilter === "PLACED" ? styles.active : ""
                  }`}
                  onClick={() => setStatusFilter("PLACED")}
                >
                  <div className={styles.statInfo}>
                    <span className={styles.label}>Mới đặt</span>
                    <h4 className={styles.count}>{stats.new}</h4>
                  </div>
                  <div className={styles.statIcon}>
                    <i className="fa-solid fa-bell"></i>
                  </div>
                </div>
                <div
                  className={`${styles.statCard} ${styles.cooking} ${
                    ["IN_PROGRESS", "CONFIRMED"].includes(statusFilter)
                      ? styles.active
                      : ""
                  }`}
                  onClick={() => setStatusFilter("IN_PROGRESS")}
                >
                  <div className={styles.statInfo}>
                    <span className={styles.label}>Đang nấu</span>
                    <h4 className={styles.count}>{stats.cooking}</h4>
                  </div>
                  <div className={styles.statIcon}>
                    <i className="fa-solid fa-fire-burner"></i>
                  </div>
                </div>
                <div
                  className={`${styles.statCard} ${styles.ready} ${
                    statusFilter === "READY_FOR_DELIVERY" ? styles.active : ""
                  }`}
                  onClick={() => setStatusFilter("READY_FOR_DELIVERY")}
                >
                  <div className={styles.statInfo}>
                    <span className={styles.label}>Chờ Drone</span>
                    <h4 className={styles.count}>{stats.ready}</h4>
                  </div>
                  <div className={styles.statIcon}>
                    <i className="fa-solid fa-box-open"></i>
                  </div>
                </div>
              </div>

              {/* TABLE */}
              <div className={styles.tableWrapper}>
                <table className={styles.customTable}>
                  <thead>
                    <tr>
                      <th style={{ width: "10%" }}>Mã đơn</th>
                      <th style={{ width: "15%" }}>Thời gian</th>
                      <th style={{ width: "15%" }}>Tổng tiền</th>
                      <th style={{ width: "20%" }}>Ghi chú</th>
                      <th style={{ width: "15%" }}>Trạng thái</th>
                      <th style={{ textAlign: "right" }}>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan="6" className={styles.loadingCell}>
                          Đang tải dữ liệu...
                        </td>
                      </tr>
                    ) : displayedOrders.length > 0 ? (
                      displayedOrders.map((order) => {
                        const isProcessing = processingId === order.id;
                        return (
                          <tr
                            key={order.id}
                            className={isProcessing ? styles.processingRow : ""}
                          >
                            <td className={styles.idCell}>
                              <strong>#{order.id}</strong>
                              {order.paymentMethod === "VNPAY" && (
                                <span className={styles.tagVnPay}>VNPAY</span>
                              )}
                            </td>
                            <td>{renderTime(order.orderTime)}</td>
                            <td className={styles.priceCell}>
                              {vnd(order.totalPrice)}
                            </td>
                            <td>
                              {order.note ? (
                                <div
                                  className={styles.noteBox}
                                  title={order.note}
                                >
                                  <i className="fa-light fa-pen"></i>{" "}
                                  {order.note}
                                </div>
                              ) : (
                                <span className={styles.noNote}>--</span>
                              )}
                            </td>
                            <td>
                              <span
                                className={`${styles.statusBadge} ${
                                  styles[order.orderStatus?.toLowerCase()]
                                }`}
                              >
                                {ORDER_STATUSES.find(
                                  (s) => s.value === order.orderStatus
                                )?.label || order.orderStatus}
                              </span>
                            </td>
                            <td>
                              <div className={styles.actionGroup}>
                                {/* STATUS FLOW */}
                                {order.orderStatus === "PLACED" && (
                                  <button
                                    className={`${styles.btnAction} ${styles.btnConfirm}`}
                                    onClick={() =>
                                      handleQuickStatus(order.id, "CONFIRMED")
                                    }
                                    disabled={isProcessing}
                                  >
                                    <i className="fa-solid fa-check"></i> Nhận
                                  </button>
                                )}
                                {order.orderStatus === "CONFIRMED" && (
                                  <button
                                    className={`${styles.btnAction} ${styles.btnCook}`}
                                    onClick={() =>
                                      handleQuickStatus(order.id, "IN_PROGRESS")
                                    }
                                    disabled={isProcessing}
                                  >
                                    <i className="fa-solid fa-fire"></i> Nấu
                                  </button>
                                )}
                                {order.orderStatus === "IN_PROGRESS" && (
                                  <button
                                    className={`${styles.btnAction} ${styles.btnDone}`}
                                    onClick={() =>
                                      handleQuickStatus(
                                        order.id,
                                        "READY_FOR_DELIVERY"
                                      )
                                    }
                                    disabled={isProcessing}
                                  >
                                    <i className="fa-solid fa-box"></i> Xong
                                  </button>
                                )}
                                {/* DISPATCH BUTTON */}
                                {order.orderStatus === "READY_FOR_DELIVERY" && (
                                  <button
                                    className={`${styles.btnAction} ${styles.btnDispatch}`}
                                    onClick={() => handleQuickDispatch(order)}
                                    disabled={isProcessing}
                                  >
                                    {isProcessing ? (
                                      <i className="fa-solid fa-circle-notch fa-spin"></i>
                                    ) : (
                                      <i className="fa-solid fa-rocket"></i>
                                    )}{" "}
                                    Gọi Drone
                                  </button>
                                )}
                                <button
                                  className={styles.btnView}
                                  onClick={() => openDetailModal(order)}
                                  title="Xem chi tiết"
                                >
                                  <i className="fa-regular fa-eye"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="6" className={styles.emptyCell}>
                          Không có đơn hàng nào.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* PAGINATION */}
                {totalPages > 1 && (
                  <div className={styles.paginationControl}>
                    <button
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      &laquo; Trước
                    </button>
                    <span>
                      Trang <strong>{currentPage}</strong> / {totalPages}
                    </span>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Sau &raquo;
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className={styles.mapContainer}>
              <DroneMap
                isEmbedded={true}
                storeId={currentStoreId}
                onOrderSelect={openDetailModal}
              />
            </div>
          )}
        </div>
      </div>

      <OrderDetailModal
        key={selectedOrder?.id || "modal"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
      />
    </>
  );
};

export default Orders;
