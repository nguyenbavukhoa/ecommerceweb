// src/pages/ServerPage/sections/Stores/Stores.jsx
import React, { useState } from "react";
import { useToast } from "../../../../context/ToastContext";
import {
  useServerStores,
  useUpdateStore,
  useDeleteStore,
} from "../../../../context/FilterProvider";
import { vnd } from "../../utils";
import styles from "./Stores.module.scss";
import RestaurantModal from "../../components/Modals/RestaurantModal";
// [FIX] Import dbService
import { db } from "../../../../services/dbService";

const COMMISSION_RATE = 0.2;

const getStatusBadge = (status) => {
  switch (status) {
    case "active":
      return (
        <span className={`${styles.badge} ${styles.active}`}>Hoạt động</span>
      );
    case "inactive":
      return (
        <span className={`${styles.badge} ${styles.inactive}`}>Tạm ngưng</span>
      );
    case "pending":
      return (
        <span className={`${styles.badge} ${styles.pending}`}>Chờ duyệt</span>
      );
    default:
      return <span>{status}</span>;
  }
};

const Stores = () => {
  const { showToast } = useToast();
  const { data: stores = [], isLoading } = useServerStores();
  const updateStoreMutation = useUpdateStore();
  const deleteStoreMutation = useDeleteStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);

  const filteredStores = stores.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setSelectedStore(null);
    setIsEditModalOpen(true);
  };
  const openEditModal = (s) => {
    setSelectedStore(s);
    setIsEditModalOpen(true);
  };

  // [FIX] Chuyển thành Async để gọi API kiểm tra
  const handleToggleStatus = async (store) => {
    const isCurrentlyActive = store.status === "active";
    const newStatus = isCurrentlyActive ? "inactive" : "active";

    if (isCurrentlyActive) {
      // 1. Kiểm tra đơn hàng (Async)
      const allOrders = await db.orders.getAll();
      const activeOrders = allOrders.filter(
        (o) =>
          o.restaurantId === store.id &&
          o.orderStatus !== "COMPLETED" &&
          o.orderStatus !== "CANCELLED"
      );

      if (activeOrders.length > 0) {
        showToast({
          title: "Không thể khóa quán",
          message: `Quán đang có ${activeOrders.length} đơn hàng đang xử lý.`,
          type: "error",
        });
        return;
      }
    }

    if (
      window.confirm(
        `Bạn muốn chuyển trạng thái sang ${
          newStatus === "active" ? "Hoạt động" : "Tạm ngưng"
        }?`
      )
    ) {
      updateStoreMutation.mutate({
        id: store.id,
        data: { status: newStatus },
      });
    }
  };

  // [FIX] Chuyển thành Async
  const handleDeleteStore = async (store) => {
    // 1. Kiểm tra ràng buộc đơn hàng (Async)
    const allOrders = await db.orders.getAll();
    const activeOrders = allOrders.filter(
      (o) =>
        o.restaurantId === store.id &&
        o.orderStatus !== "COMPLETED" &&
        o.orderStatus !== "CANCELLED"
    );

    if (activeOrders.length > 0) {
      showToast({
        title: "Không thể xóa quán",
        message: `Quán đang có ${activeOrders.length} đơn hàng chưa hoàn tất.`,
        type: "error",
      });
      return;
    }

    // 2. Kiểm tra tài chính
    if (store.revenue > 0) {
      if (
        !window.confirm(
          `Cảnh báo: Quán này còn doanh thu ${vnd(
            store.revenue
          )} chưa thanh toán. Bạn có chắc chắn muốn xóa không?`
        )
      ) {
        return;
      }
    }

    // 3. Xóa
    if (
      window.confirm(
        `Bạn có chắc chắn muốn XÓA VĨNH VIỄN cửa hàng "${store.name}"?`
      )
    ) {
      if (
        window.confirm(
          "Hành động này KHÔNG THỂ hoàn tác! Mọi dữ liệu liên quan sẽ mất. Bạn vẫn muốn xóa?"
        )
      ) {
        deleteStoreMutation.mutate(store.id);
      }
    }
  };

  return (
    <>
      <div className={styles.section}>
        {/* ... (Phần UI Table giữ nguyên như cũ) ... */}
        <div className={styles.adminControl}>
          {/* Copy lại UI header cũ */}
          <div className={styles.adminControlLeft}>
            <h2 className={styles.pageTitle}>🏪 Quản lý Đối tác (Merchant)</h2>
          </div>
          <div className={styles.adminControlCenter}>
            <div className={styles.searchBox}>
              <i className="fa-light fa-magnifying-glass"></i>
              <input
                type="text"
                placeholder="Tìm kiếm cửa hàng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.adminControlRight}>
            <button className={styles.btnAdd} onClick={openAddModal}>
              <i className="fa-light fa-plus"></i> Thêm Merchant
            </button>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Thông tin cửa hàng</th>
                <th>Chủ sở hữu</th>
                <th>Doanh thu (20% / 80%)</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6">Đang tải...</td>
                </tr>
              ) : filteredStores.length > 0 ? (
                filteredStores.map((s) => {
                  const revenue = s.revenue || 0;
                  const grabShare = revenue * COMMISSION_RATE;
                  const storeShare = revenue - grabShare;

                  return (
                    <tr key={s.id}>
                      <td>
                        <strong>{s.id}</strong>
                      </td>
                      <td>
                        <div className={styles.storeName}>{s.name}</div>
                        <div className={styles.storeAddr}>{s.address}</div>
                        <div style={{ fontSize: "12px", color: "#888" }}>
                          {s.phone}
                        </div>
                      </td>
                      <td>{s.owner || "---"}</td>
                      <td>
                        <div className={styles.revenue}>{vnd(revenue)}</div>
                        <div
                          style={{
                            fontSize: "11px",
                            color: "#555",
                            marginTop: "2px",
                          }}
                        >
                          <span style={{ color: "#c0392b" }}>
                            Sàn: {vnd(grabShare)}
                          </span>{" "}
                          |
                          <span style={{ color: "#27ae60" }}>
                            {" "}
                            Quán: {vnd(storeShare)}
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: "10px",
                            color: "#999",
                            marginTop: "2px",
                          }}
                        >
                          ({s.totalOrders || 0} đơn)
                        </div>
                      </td>
                      <td>{getStatusBadge(s.status)}</td>
                      <td>
                        <div className={styles.actions}>
                          <button
                            className={styles.btnEdit}
                            onClick={() => openEditModal(s)}
                            title="Chỉnh sửa"
                          >
                            <i className="fa-light fa-pen-to-square"></i>
                          </button>
                          <button
                            className={styles.btnLock}
                            onClick={() => handleToggleStatus(s)}
                            title={
                              s.status === "active" ? "Khóa quán" : "Mở quán"
                            }
                          >
                            <i
                              className={`fa-light ${
                                s.status === "active" ? "fa-lock" : "fa-unlock"
                              }`}
                            ></i>
                          </button>
                          <button
                            className={styles.btnDelete}
                            onClick={() => handleDeleteStore(s)}
                            title="Xóa vĩnh viễn"
                          >
                            <i className="fa-light fa-trash-can"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6">Không tìm thấy cửa hàng nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <RestaurantModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        restaurant={selectedStore}
        onSaveSuccess={() => setIsEditModalOpen(false)}
      />
    </>
  );
};

export default Stores;
