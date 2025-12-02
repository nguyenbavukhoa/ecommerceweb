import React, { useState, useEffect } from "react";
import CommonModal from "../../../AdminPage/components/Modals/CommonModal";
import { useToast } from "../../../../context/ToastContext";
import styles from "./CustomerModal.module.scss"; // Dùng lại style form

// 1. IMPORT HOOK
import {
  useServerStores,
  useCreateUser,
  useUpdateUser,
} from "../../../../context/FilterProvider";

const UserModal = ({ isOpen, onClose, userToEdit, onSaveSuccess }) => {
  const { showToast } = useToast();

  // 2. GỌI HOOK
  const { data: stores = [] } = useServerStores();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  const isEdit = !!userToEdit;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "customer", // customer | admin
    status: "active",
    storeId: "",
    reportNote: "",
  });

  // Load dữ liệu khi mở modal
  useEffect(() => {
    if (isOpen) {
      if (isEdit) {
        setForm({
          // Map dữ liệu từ userToEdit (lưu ý tên trường trong mockData)
          name: userToEdit.fullName || userToEdit.name || "",
          email: userToEdit.email || "",
          phone: userToEdit.phoneNumber || userToEdit.phone || "",
          password: "", // Không hiển thị pass cũ
          role: userToEdit.role || "customer",
          status: userToEdit.status ? "active" : "blocked", // Map boolean/string status
          storeId: userToEdit.storeId || "",
          reportNote: userToEdit.reportNote || "",
        });
      } else {
        setForm({
          name: "",
          email: "",
          phone: "",
          password: "",
          role: "customer",
          status: "active",
          storeId: "",
          reportNote: "",
        });
      }
    }
  }, [isOpen, isEdit, userToEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    if (!form.email || !form.name) {
      showToast("warning", "Vui lòng nhập tên và email");
      return;
    }

    // Validate riêng cho Admin: Phải chọn nhà hàng
    if (form.role === "admin" && !form.storeId) {
      showToast("warning", "Đối tác bắt buộc phải chọn Nhà hàng quản lý!");
      return;
    }

    try {
      // Chuẩn bị payload
      const payload = {
        fullName: form.name, // Map lại tên trường cho khớp DB
        email: form.email,
        phoneNumber: form.phone,
        role: form.role.toUpperCase(), // DB lưu 'ADMIN'/'USER'
        userType: form.role === "admin" ? 1 : 0,
        storeId: form.role === "admin" ? form.storeId : null,
        reportNote: form.reportNote,
        // Status: DB dùng boolean (true/false), Form dùng string ('active'/'blocked')
        status: form.status === "active",
      };

      if (form.password) payload.password = form.password;

      if (isEdit) {
        // UPDATE
        await updateUserMutation.mutateAsync({
          id: userToEdit.id,
          ...payload,
        });
      } else {
        // CREATE
        await createUserMutation.mutateAsync(payload);
      }

      onSaveSuccess(); // Đóng modal
    } catch (error) {
      // Lỗi đã được xử lý trong hook
    }
  };

  const isLoading =
    createUserMutation.isPending || updateUserMutation.isPending;

  return (
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "CHỈNH SỬA TÀI KHOẢN" : "THÊM TÀI KHOẢN MỚI"}
      customWidth="550px"
    >
      <div className={styles.formContent}>
        <form className={styles.signupForm} onSubmit={handleSubmit}>
          {!isEdit && (
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Loại tài khoản</label>
              <select
                className={styles.formControl}
                name="role"
                value={form.role}
                onChange={handleChange}
              >
                <option value="customer">Khách hàng (App User)</option>
                <option value="admin">Đối tác / Quản lý (Web Admin)</option>
              </select>
            </div>
          )}

          {/* DROPDOWN CHỌN NHÀ HÀNG (CHỈ HIỆN KHI CHỌN ADMIN) */}
          {form.role === "admin" && (
            <div
              className={styles.formGroup}
              style={{
                background: "#f9f9f9",
                padding: "10px",
                borderRadius: "6px",
                border: "1px dashed #ccc",
              }}
            >
              <label className={styles.formLabel} style={{ color: "#b5292f" }}>
                <i className="fa-light fa-store"></i> Nhà hàng quản lý{" "}
                <span style={{ color: "red" }}>*</span>
              </label>
              <select
                className={styles.formControl}
                name="storeId"
                value={form.storeId}
                onChange={handleChange}
              >
                <option value="">-- Chọn nhà hàng --</option>
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name} (ID: {store.id})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Họ và tên</label>
            <input
              className={styles.formControl}
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nhập họ tên..."
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Email</label>
            <input
              className={styles.formControl}
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              disabled={isEdit} // Không cho sửa email
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Số điện thoại</label>
            <input
              className={styles.formControl}
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              {isEdit ? "Mật khẩu mới (Bỏ trống nếu không đổi)" : "Mật khẩu"}
            </label>
            <input
              className={styles.formControl}
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          {/* GHI CHÚ / BÁO CÁO */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Ghi chú / Báo cáo vi phạm
            </label>
            <textarea
              className={styles.formControl}
              name="reportNote"
              value={form.reportNote}
              onChange={handleChange}
              placeholder="VD: Khách hay bom hàng, hoặc Ghi chú nội bộ..."
              style={{ height: "80px", resize: "vertical" }}
            />
          </div>

          {isEdit && (
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Trạng thái</label>
              <select
                className={styles.formControl}
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="active">Hoạt động</option>
                <option value="blocked">Đã khóa</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className={styles.formSubmit}
            disabled={isLoading}
          >
            {isLoading
              ? "Đang xử lý..."
              : isEdit
              ? "Lưu thay đổi"
              : "Tạo tài khoản"}
          </button>
        </form>
      </div>
    </CommonModal>
  );
};

export default UserModal;
