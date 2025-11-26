// src/pages/ServerPage/sections/Users/Users.jsx
import React, { useState, useEffect } from "react";
import { useToast } from "../../../../context/ToastContext";
import {
  useServerUsers,
  useServerStores,
  useUpdateUser, // Import Hook Update
} from "../../../../context/FilterProvider";
import UserModal from "../../components/Modals/UserModal";
import styles from "./Users.module.scss";

// ... (Các hàm getStatusBadge, getRoleBadge giữ nguyên) ...
const getStatusBadge = (status) => {
  switch (status) {
    case "active":
      return (
        <span className={`${styles.badge} ${styles.active}`}>Hoạt động</span>
      );
    case "blocked":
      return (
        <span className={`${styles.badge} ${styles.blocked}`}>Đã khóa</span>
      );
    case "pending":
      return (
        <span className={`${styles.badge} ${styles.pending}`}>Chờ duyệt</span>
      );
    default:
      return <span>{status}</span>;
  }
};

const getRoleBadge = (role) => {
  return role === "admin" ? (
    <span className={`${styles.badge} ${styles.admin}`}>Đối tác</span>
  ) : (
    <span className={`${styles.badge} ${styles.customer}`}>User</span>
  );
};

const Users = () => {
  const { showToast } = useToast();

  // 1. Lấy dữ liệu từ Hook (Luôn tươi mới từ DB)
  const { data: users = [], isLoading } = useServerUsers();
  const { data: stores = [] } = useServerStores();

  const updateUserMutation = useUpdateUser(); // Hook để xử lý khóa/duyệt nhanh

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("customer");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // 2. Filter trên dữ liệu lấy về
  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    // Chuẩn hóa role để so sánh (DB có thể lưu 'ADMIN' hoa)
    const uRole = u.role?.toLowerCase() || "user";
    const matchRole =
      activeTab === "customer"
        ? uRole === "user" || uRole === "customer"
        : uRole === "admin";
    return matchSearch && matchRole;
  });

  // --- HANDLERS ---
  const handleAddUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // 3. Logic Khóa/Mở khóa (Gọi API thật)
  const handleToggleStatus = (id) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;

    const newStatus = user.status === "active" ? false : true; // DB lưu boolean, hoặc string 'blocked' tùy mockData của bạn
    // Lưu ý: MockData hiện tại dùng boolean (true=active, false=blocked) hoặc string.
    // Để an toàn, ta check mockData.js: status là boolean.
    // Nhưng UserModal lại map 'active'/'blocked'. Cần thống nhất.
    // GIẢI PHÁP: Ở đây ta gửi boolean, bên UserModal đã xử lý map rồi.

    const action = newStatus ? "mở khóa" : "khóa";
    if (window.confirm(`Bạn có chắc chắn muốn ${action} tài khoản này?`)) {
      updateUserMutation.mutate({
        id: user.id,
        status: newStatus,
      });
    }
  };

  // Logic Duyệt
  const handleApproveUser = (id) => {
    if (window.confirm("Duyệt tài khoản đối tác này?")) {
      updateUserMutation.mutate({ id, status: true }); // Active
    }
  };

  const handleRejectUser = (id) => {
    if (window.confirm("Từ chối yêu cầu này?")) {
      // Có thể xóa hoặc set status = false
      updateUserMutation.mutate({ id, status: false });
    }
  };

  // Khi Modal lưu xong, chỉ cần đóng modal. React Query sẽ tự refresh list.
  const handleSaveSuccess = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.section}>
      <div className={styles.adminControl}>
        <div className={styles.adminControlLeft}>
          <h2 className={styles.pageTitle}>👥 Quản lý Tài khoản</h2>
        </div>
        <div className={styles.adminControlRight}>
          <button className={styles.btnAdd} onClick={handleAddUser}>
            <i className="fa-light fa-plus"></i> Thêm tài khoản
          </button>
        </div>
      </div>

      {/* ... (Phần Tab và Search giữ nguyên) ... */}
      <div className={styles.tabContainer}>
        <button
          className={`${styles.tabBtn} ${
            activeTab === "customer" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("customer")}
        >
          <i className="fa-light fa-users"></i> Khách hàng
        </button>
        <button
          className={`${styles.tabBtn} ${
            activeTab === "admin" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("admin")}
        >
          <i className="fa-light fa-user-tie"></i> Đối tác & Admin
        </button>
      </div>

      <div
        className={styles.searchBox}
        style={{ marginBottom: "20px", maxWidth: "400px" }}
      >
        <i className="fa-light fa-magnifying-glass"></i>
        <input
          type="text"
          placeholder={`Tìm kiếm...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Thông tin tài khoản</th>
              <th>Liên hệ</th>
              <th>Vai trò</th>
              <th>
                {activeTab === "customer"
                  ? "Tổng đơn hàng"
                  : "Nhà hàng quản lý"}
              </th>
              <th>Ghi chú</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan="8"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => {
                const linkedStore = stores.find((s) => s.id === user.storeId);
                // Map status từ boolean sang string để hiển thị badge
                const statusStr = user.status === true ? "active" : "blocked";

                return (
                  <tr key={user.id}>
                    <td>
                      <strong>{user.id}</strong>
                    </td>
                    <td>
                      <div className={styles.userName}>
                        {user.fullName || user.name}
                      </div>
                      <div className={styles.userEmail}>{user.email}</div>
                    </td>
                    <td>{user.phoneNumber || user.phone || "---"}</td>
                    <td>{getRoleBadge(user.role?.toLowerCase())}</td>

                    <td>
                      {activeTab === "customer" ? (
                        // Mock data chưa có totalOrders, hiển thị tạm hoặc tính toán
                        <span style={{ fontWeight: 600 }}>
                          {user.totalOrders || 0} đơn
                        </span>
                      ) : linkedStore ? (
                        <span style={{ color: "#2980b9", fontWeight: 600 }}>
                          <i className="fa-light fa-store"></i>{" "}
                          {linkedStore.name}
                        </span>
                      ) : (
                        <span style={{ color: "#999", fontStyle: "italic" }}>
                          Chưa gán
                        </span>
                      )}
                    </td>

                    <td>
                      {user.reportNote ? (
                        <span style={{ color: "#c0392b" }}>
                          {user.reportNote}
                        </span>
                      ) : (
                        "---"
                      )}
                    </td>

                    <td>{getStatusBadge(statusStr)}</td>

                    <td>
                      <div className={styles.actions}>
                        <button
                          className={styles.btnEdit}
                          onClick={() => handleEditUser(user)}
                          title="Sửa"
                        >
                          <i className="fa-light fa-pen-to-square"></i>
                        </button>

                        {/* Nút Khóa/Mở khóa */}
                        <button
                          className={
                            statusStr === "active"
                              ? styles.btnLock
                              : styles.btnUnlock
                          }
                          onClick={() => handleToggleStatus(user.id)}
                          title={statusStr === "active" ? "Khóa" : "Mở khóa"}
                        >
                          <i
                            className={`fa-light ${
                              statusStr === "active"
                                ? "fa-lock"
                                : "fa-lock-open"
                            }`}
                          ></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="8"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  Không tìm thấy dữ liệu.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userToEdit={selectedUser}
        onSaveSuccess={handleSaveSuccess}
      />
    </div>
  );
};

export default Users;
