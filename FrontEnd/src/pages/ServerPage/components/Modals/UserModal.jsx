import React, { useState, useEffect } from "react";
import CommonModal from "../../../AdminPage/components/Modals/CommonModal";
import { useToast } from "../../../../context/ToastContext";
import styles from "./CustomerModal.module.scss"; // Giữ nguyên file style cũ

// 1. IMPORT HOOK API MỚI
import {
  useServerStores,
  useCreateUser,
  useUpdateUser,
} from "../../../../context/FilterProvider";

const UserModal = ({ isOpen, onClose, userToEdit, onSaveSuccess }) => {
  const { showToast } = useToast();

  // 2. GỌI HOOK API
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
        // [LOGIC MỚI] Map dữ liệu từ API về Form State cũ
        setForm({
          name: userToEdit.accountName || userToEdit.fullName || "",
          email: userToEdit.email || "",
          phone: userToEdit.phoneNumber || userToEdit.phone || "",
          password: "", // Không hiển thị pass cũ

          // Map Role API (UPPERCASE) -> Role Form (lowercase)
          role:
            userToEdit.role === "ADMIN" || userToEdit.role === "STORE_OWNER"
              ? "admin"
              : "customer",

          // Map Active Boolean -> Status String
          status:
            userToEdit.active === true || String(userToEdit.active) === "true"
              ? "active"
              : "blocked",

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
      showToast({
        title: "Cảnh báo",
        message: "Vui lòng nhập tên và email",
        type: "warning",
      });
      return;
    }

    // Validate Password khi tạo mới
    if (!isEdit && !form.password) {
      showToast({
        title: "Cảnh báo",
        message: "Vui lòng nhập mật khẩu",
        type: "warning",
      });
      return;
    }

    // Validate riêng cho Admin: Phải chọn nhà hàng
    if (form.role === "admin" && !form.storeId) {
      showToast({
        title: "Cảnh báo",
        message: "Đối tác bắt buộc phải chọn Nhà hàng quản lý!",
        type: "warning",
      });
      return;
    }

    try {
      // [LOGIC MỚI] Chuẩn bị payload gửi API
      // Form dùng 'customer'/'admin' -> API cần 'USER'/'STORE_OWNER'/'ADMIN'
      let apiRole = "USER";
      if (form.role === "admin") {
        // Logic tùy chọn: Nếu chọn admin thì gán là STORE_OWNER hay ADMIN?
        // Ở đây giả định là STORE_OWNER (Chủ quán) vì có chọn storeId
        apiRole = "STORE_OWNER";
      }

      const payload = {
        fullName: form.name, // Map sang accountName
        email: form.email,
        phoneNumber: form.phone,
        role: apiRole,
        storeId: form.role === "admin" ? form.storeId : null,
        reportNote: form.reportNote,
        // Map string 'active' -> boolean true
        active: form.status === "active",
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

  // --- UI GIỮ NGUYÊN HOÀN TOÀN ---
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
              style={
                isEdit
                  ? { backgroundColor: "#f5f5f5", cursor: "not-allowed" }
                  : {}
              }
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Số điện thoại</label>
            <input
              className={styles.formControl}
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="0909..."
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
