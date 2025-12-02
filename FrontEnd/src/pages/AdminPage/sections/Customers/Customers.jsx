import React, { useState, useEffect, useMemo } from "react";
import { useToast } from "../../../../context/ToastContext";
import CustomerModal from "../../components/Modals/CustomerModal";
import styles from "./Customers.module.scss";
import { formatDate } from "../../utils";

import { useCustomers, useSaveUser } from "../../../../context/FilterProvider";
import { useQueryClient } from "@tanstack/react-query";

const Customers = () => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  // === 1. GỌI API & LỌC CHỈ LẤY USER (userType === 0) ===
  const { data: rawData = [], isLoading, error } = useCustomers();

  // Biến allCustomers giờ chỉ chứa User thường, Admin bị loại bỏ
  const allCustomers = useMemo(() => {
    return rawData.filter((user) => user.userType === 0);
  }, [rawData]);

  // Filters
  const [statusFilter, setStatusFilter] = useState("2");
  const [searchTerm, setSearchTerm] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");

  const { mutateAsync: saveUser } = useSaveUser();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState(null);

  // === 2. LOGIC LỌC TÌM KIẾM (Client-side) ===
  const filteredCustomers = useMemo(() => {
    let result = allCustomers;

    // Lọc trạng thái
    if (statusFilter !== "2") {
      const statusBool = statusFilter === "1";
      result = result.filter((item) => item.status === statusBool);
    }

    // Lọc tìm kiếm
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          (item.fullName &&
            item.fullName.toLowerCase().includes(lowerSearch)) ||
          (item.email && item.email.toLowerCase().includes(lowerSearch))
      );
    }

    // Lọc thời gian
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
        result = result.filter(
          (item) =>
            new Date(item.createAt) >= startTime &&
            new Date(item.createAt) <= endTime
        );
      }
    } catch (e) {
      console.error("Lỗi lọc thời gian:", e);
    }

    // Sắp xếp mới nhất
    return result.sort((a, b) => new Date(b.createAt) - new Date(a.createAt));
  }, [allCustomers, statusFilter, searchTerm, timeStart, timeEnd]);

  const handleCancelSearch = () => {
    setStatusFilter("2");
    setSearchTerm("");
    setTimeStart("");
    setTimeEnd("");
  };

  const openAddModal = () => {
    setCustomerToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (customer) => {
    setCustomerToEdit(customer);
    setIsModalOpen(true);
  };

  const handleStatusToggle = async (user) => {
    const newStatus = !user.status;
    const action = newStatus ? "kích hoạt" : "khóa";

    if (
      !window.confirm(
        `Bạn có chắc chắn muốn ${action} tài khoản ${user.fullName}?`
      )
    )
      return;

    try {
      await saveUser(
        { id: user.id, status: newStatus },
        { variables: { isStatusToggle: true } }
      );
    } catch (err) {}
  };

  const handleSaveSuccess = () => {
    setIsModalOpen(false);
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
              <option value="2">Tất cả trạng thái</option>
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
                placeholder="Tìm tên hoặc email..."
                value={searchTerm}
                onInput={(e) => setSearchTerm(e.target.value)}
              />
            </form>
          </div>
          <div className={styles.adminControlRight}>
            <form className={styles.fillterDate}>
              <div>
                <label>Từ</label>
                <input
                  type="date"
                  className={styles.formControlDate}
                  value={timeStart}
                  onChange={(e) => setTimeStart(e.target.value)}
                />
              </div>
              <div>
                <label>Đến</label>
                <input
                  type="date"
                  className={styles.formControlDate}
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

        <div className={styles.table}>
          <table width="100%">
            <thead>
              <tr>
                <td>ID</td>
                <td>Họ và tên</td>
                <td>Email</td>
                <td>Ngày tham gia</td>
                {/* Đã bỏ cột Vai trò vì toàn bộ là User */}
                <td>Tình trạng</td>
                <td className="text-center">Thao tác</td>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    Đang tải...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    Lỗi: {error.message}
                  </td>
                </tr>
              ) : filteredCustomers.length > 0 ? (
                filteredCustomers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.fullName}</td>
                    <td>{user.email}</td>
                    <td>{formatDate(user.createAt)}</td>
                    <td>
                      {user.status ? (
                        <span className={styles.statusComplete}>Hoạt động</span>
                      ) : (
                        <span className={styles.statusNoComplete}>Bị khóa</span>
                      )}
                    </td>
                    <td className={styles.controlTable}>
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
                      <button
                        className={styles.btnEdit}
                        onClick={() => openEditModal(user)}
                      >
                        <i className="fa-light fa-pen-to-square"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    Không tìm thấy khách hàng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customerToEdit={customerToEdit}
        onSaveSuccess={handleSaveSuccess}
      />
    </>
  );
};

export default Customers;
