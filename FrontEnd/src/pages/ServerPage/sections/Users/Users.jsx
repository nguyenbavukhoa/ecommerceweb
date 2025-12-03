import React, { useState } from "react";
import { useToast } from "../../../../context/ToastContext";
import {
  useServerUsers,
  useUpdateUser,
  useDeleteUser,
} from "../../../../context/FilterProvider";
import UserModal from "../../components/Modals/UserModal";
import styles from "./Users.module.scss";

// Helper hiển thị trạng thái
const getStatusBadge = (active) => {
  const isActive = active === true || String(active) === "true";
  return isActive ? (
    <span className={`${styles.badge} ${styles.active}`}>Hoạt động</span>
  ) : (
    <span className={`${styles.badge} ${styles.blocked}`}>Đã khóa</span>
  );
};

// Helper hiển thị quyền hạn (Logic: User vs Phần còn lại)
const getRoleBadge = (role) => {
  const r = role?.toUpperCase() || "USER";

  if (r === "USER") {
    return (
      <span className={`${styles.badge} ${styles.customer}`}>Khách hàng</span>
    );
  }

  // Các role quản trị
  let label = r;
  if (r === "ADMIN") label = "Admin";
  else if (r === "STORE_OWNER") label = "Chủ quán";
  else if (r === "STAFF") label = "Nhân viên";

  return <span className={`${styles.badge} ${styles.admin}`}>{label}</span>;
};

const Users = () => {
  const { showToast } = useToast();
  // Lấy dữ liệu từ API
  const { data: users = [], isLoading } = useServerUsers();

  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("customer"); // 'customer' | 'partner'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // --- LOGIC LỌC DỮ LIỆU (SỬA THEO YÊU CẦU MỚI) ---
  const filteredUsers = users.filter((u) => {
    // 1. Tìm kiếm
    const name = u.accountName || u.fullName || "";
    const email = u.email || "";
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      name.toLowerCase().includes(searchLower) ||
      email.toLowerCase().includes(searchLower);

    // 2. Phân loại Tab
    const role = u.role?.toUpperCase() || "USER";
    const isCustomerRole = role === "USER"; // Chỉ USER là khách

    // Nếu tab hiện tại là 'customer' -> Lấy USER
    // Nếu tab hiện tại là 'partner' -> Lấy TẤT CẢ CÁI KHÁC (Admin, StoreOwner...)
    const matchesTab =
      activeTab === "customer" ? isCustomerRole : !isCustomerRole;

    return matchesSearch && matchesTab;
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

  const handleToggleStatus = (user) => {
    const isActive = user.active === true || String(user.active) === "true";
    const newStatus = !isActive;
    const actionName = newStatus ? "MỞ KHÓA" : "KHÓA";

    if (
      window.confirm(
        `Bạn có chắc muốn ${actionName} tài khoản "${user.email}"?`
      )
    ) {
      updateUserMutation.mutate({
        id: user.id,
        active: newStatus,
      });
    }
  };

  const handleDeleteUser = (user) => {
    if (
      window.confirm(
        `Cảnh báo: Bạn chắc chắn muốn XÓA VĨNH VIỄN tài khoản "${user.email}"?`
      )
    ) {
      deleteUserMutation.mutate(user.id);
    }
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

      <div className={styles.tabContainer}>
        <button
          className={`${styles.tabBtn} ${
            activeTab === "customer" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("customer")}
        >
          <i className="fa-light fa-users"></i> Khách hàng (User)
        </button>
        <button
          className={`${styles.tabBtn} ${
            activeTab === "partner" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("partner")}
        >
          <i className="fa-light fa-user-tie"></i> Quản trị (Admin/Partner)
        </button>
      </div>

      <div
        className={styles.searchBox}
        style={{ margin: "20px 0", maxWidth: "400px" }}
      >
        <i className="fa-light fa-magnifying-glass"></i>
        <input
          type="text"
          placeholder="Tìm kiếm theo tên hoặc email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Thông tin tài khoản</th>
              <th>Vai trò</th>
              <th>Ngày tạo</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan="6"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <strong>{user.id}</strong>
                  </td>
                  <td>
                    <div className={styles.userName}>
                      {user.accountName || user.fullName}
                    </div>
                    <div className={styles.userEmail}>{user.email}</div>
                  </td>
                  <td>{getRoleBadge(user.role)}</td>
                  <td>
                    {user.createAt
                      ? new Date(user.createAt).toLocaleDateString("vi-VN")
                      : "---"}
                  </td>
                  <td>{getStatusBadge(user.active)}</td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.btnEdit}
                        onClick={() => handleEditUser(user)}
                        title="Sửa thông tin"
                      >
                        <i className="fa-light fa-pen-to-square"></i>
                      </button>
                      <button
                        className={
                          user.active === true || String(user.active) === "true"
                            ? styles.btnLock
                            : styles.btnUnlock
                        }
                        onClick={() => handleToggleStatus(user)}
                        title={
                          user.active === true || String(user.active) === "true"
                            ? "Khóa"
                            : "Mở khóa"
                        }
                      >
                        <i
                          className={`fa-light ${
                            user.active === true ||
                            String(user.active) === "true"
                              ? "fa-lock"
                              : "fa-lock-open"
                          }`}
                        ></i>
                      </button>
                      <button
                        className={styles.btnDelete}
                        onClick={() => handleDeleteUser(user)}
                        title="Xóa"
                      >
                        <i className="fa-light fa-trash-can"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  Không tìm thấy tài khoản nào.
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
        onSaveSuccess={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Users;
