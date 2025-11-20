import React, { useState, useEffect, useMemo } from "react";
import { useToast } from "../../../../context/ToastContext";
import CustomerModal from "../../components/Modals/CustomerModal";
import styles from "./Customers.module.scss";
import { formatDate } from "../../utils";

// === 1. IMPORT HOOK MỚI ===
import { useCustomers } from "../../../../context/FilterProvider";
import { useQueryClient } from "@tanstack/react-query";

const Customers = () => {
  const { showToast } = useToast();

  // === 2. GỌI API BẰNG REACT QUERY ===
  const queryClient = useQueryClient();
  const { data: allCustomers = [], isLoading, error } = useCustomers();

  // Filters (giữ nguyên)
  const [statusFilter, setStatusFilter] = useState("2"); // '2' = Tất cả
  const [searchTerm, setSearchTerm] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");

  // Modal (sửa: customerToEdit sẽ là object)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState(null);

  // === 3. SỬA LẠI LOGIC LỌC (useMemo) ===
  // (Vì API không hỗ trợ, chúng ta lọc phía client)
  const filteredCustomers = useMemo(() => {
    let result = allCustomers;

    // Lọc trạng thái (Sửa: 'item.status' là boolean)
    if (statusFilter !== "2") {
      const statusBool = statusFilter === "1"; // "1" là true (Hoạt động)
      result = result.filter((item) => item.status === statusBool);
    }

    // Lọc tìm kiếm (Sửa: tìm theo 'accountName' và 'email')
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.accountName.toLowerCase().includes(lowerSearch) ||
          item.email.toLowerCase().includes(lowerSearch)
      );
    }

    // Lọc thời gian (Sửa: dùng 'createAt')
    try {
      if (timeStart && !timeEnd) {
        const startTime = new Date(timeStart).setHours(0, 0, 0, 0);
        result = result.filter((item) => new Date(item.createAt) >= startTime);
      } else if (!timeStart && timeEnd) {
        const endTime = new Date(timeEnd).setHours(23, 59, 59, 999);
        result = result.filter((item) => new Date(item.createAt) <= endTime);
      } else if (timeStart && timeEnd) {
        const startTime = new Date(timeStart).setHours(0, 0, 0, 0);
        const endTime = new Date(timeEnd).setHours(23, 59, 59, 999);
        if (startTime > endTime) {
          // (Logic toast lỗi giữ nguyên)
        }
        result = result.filter(
          (item) =>
            new Date(item.createAt) >= startTime &&
            new Date(item.createAt) <= endTime
        );
      }
    } catch (e) {
      console.error("Lỗi lọc thời gian:", e);
    }

    return result;
  }, [allCustomers, statusFilter, searchTerm, timeStart, timeEnd]);

  const handleCancelSearch = () => {
    setStatusFilter("2");
    setSearchTerm("");
    setTimeStart("");
    setTimeEnd("");
  };

  // === 4. SỬA LẠI HÀM CRUD ===
  const openAddModal = () => {
    setCustomerToEdit(null); // Thêm mới
    setIsModalOpen(true);
  };

  const openEditModal = (customer) => {
    setCustomerToEdit(customer); // Sửa (gửi cả object)
    setIsModalOpen(true);
  };

  // Nút gạt (MỚI)
  const handleStatusToggle = (customer) => {
    // Như bạn nói, API chưa có, nên chỉ thông báo
    showToast({
      title: "Chưa hỗ trợ",
      message: "API để kích hoạt/khóa tài khoản chưa có.",
      type: "warning",
    });
  };

  // Hàm này sẽ được gọi khi modal lưu (API) thành công
  const handleSaveSuccess = () => {
    setIsModalOpen(false);
    // Yêu cầu React Query tải lại danh sách
    queryClient.invalidateQueries(["customers"]);
  };

  return (
    <>
      <div className={styles.section}>
        <div className={styles.adminControl}>
          <div className={styles.adminControlLeft}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="2">Tất cả</option>
              <option value="1">Hoạt động</option>
              <option value="0">Bị khóa</option>
            </select>
          </div>
          <div className={styles.adminControlCenter}>
            <form
              className={styles.formSearch}
              onSubmit={(e) => e.preventDefault()}
            >
              <span className={styles.searchBtn}>
                <i className="fa-light fa-magnifying-glass"></i>
              </span>
              <input
                type="text"
                className={styles.formSearchInput}
                placeholder="Tìm kiếm Tên hoặc Email..." // Sửa placeholder
                value={searchTerm}
                onInput={(e) => setSearchTerm(e.target.value)}
              />
            </form>
          </div>
          <div className={styles.adminControlRight}>
            {/* ... (Phần lọc ngày và nút reset giữ nguyên) ... */}
            <form className={styles.fillterDate}>
              <div>
                <label htmlFor="time-start-user">Từ</label>
                <input
                  type="date"
                  className={styles.formControlDate}
                  id="time-start-user"
                  value={timeStart}
                  onChange={(e) => setTimeStart(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="time-end-user">Đến</label>
                <input
                  type="date"
                  className={styles.formControlDate}
                  id="time-end-user"
                  value={timeEnd}
                  onChange={(e) => setTimeEnd(e.target.value)}
                />
              </div>
            </form>
            <button
              className={styles.btnResetOrder}
              onClick={handleCancelSearch}
              title="Làm mới"
            >
              <i className="fa-light fa-arrow-rotate-right"></i>
            </button>
            <button className={styles.btnControlLarge} onClick={openAddModal}>
              <i className="fa-light fa-plus"></i> <span>Thêm khách hàng</span>
            </button>
          </div>
        </div>

        {/* === 5. SỬA BẢNG HIỂN THỊ === */}
        <div className={styles.table}>
          <table width="100%">
            <thead>
              <tr>
                <td>ID</td>
                <td>Họ và tên</td>
                <td>Email</td>
                <td>Ngày tham gia</td>
                <td>Vai trò</td>
                <td>Tình trạng</td>
                <td>Thao tác</td>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="7">Đang tải...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7">Lỗi: {error.message}</td>
                </tr>
              ) : filteredCustomers.length > 0 ? (
                filteredCustomers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.accountName}</td>
                    <td>{user.email}</td>
                    <td>{formatDate(user.createAt)}</td>
                    <td>{user.role}</td>
                    <td>
                      {user.status ? (
                        <span className={styles.statusComplete}>Hoạt động</span>
                      ) : (
                        <span className={styles.statusNoComplete}>Bị khóa</span>
                      )}
                    </td>
                    <td className={styles.controlTable}>
                      {/* Nút gạt MỚI */}
                      <label
                        className={styles.statusToggle}
                        title={user.status ? "Hoạt động" : "Đã khóa"}
                      >
                        <input
                          type="checkbox"
                          checked={user.status}
                          onChange={() => handleStatusToggle(user)}
                        />
                        <span className={styles.slider}></span>
                      </label>
                      {/* Nút Sửa (Sửa: Gửi cả object) */}
                      <button
                        className={styles.btnEdit}
                        onClick={() => openEditModal(user)}
                      >
                        <i className="fa-light fa-pen-to-square"></i>
                      </button>
                      {/* Bỏ nút Xóa (vì đã có khóa) */}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">Không có dữ liệu</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customerToEdit={customerToEdit} // Gửi object (hoặc null)
        onSaveSuccess={handleSaveSuccess}
      />
    </>
  );
};

export default Customers;
