import React, { useState, useEffect } from "react";
import CommonModal from "../../../AdminPage/components/Modals/CommonModal";
import { useToast } from "../../../../context/ToastContext";
import styles from "./UserModal.module.scss";

// Import Service thay vì Hook cũ (để kiểm soát logic tốt hơn)
import authService from "../../../../services/authService";
// Hoặc nếu bạn muốn dùng hook từ FilterProvider thì phải đảm bảo hook đó gọi đúng service mới

const UserModal = ({ isOpen, onClose, userToEdit, onSaveSuccess }) => {
  const { showToast } = useToast();
  const isEdit = !!userToEdit;
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "", // Chỉ hiện khi tạo mới
    role: "user", // user | admin
    status: "active",
  });

  // Load dữ liệu khi sửa
  useEffect(() => {
    if (isOpen) {
      if (isEdit) {
        setForm({
          name: userToEdit.accountName || userToEdit.fullName || "",
          email: userToEdit.email || "",
          password: "", // Không hiện mật khẩu cũ
          role: userToEdit.role === "ADMIN" ? "admin" : "user",
          status: userToEdit.status ? "active" : "blocked",
        });
      } else {
        // Reset form khi tạo mới
        setForm({
          name: "",
          email: "",
          password: "",
          role: "user",
          status: "active",
        });
      }
    }
  }, [isOpen, isEdit, userToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isEdit) {
        // --- LOGIC CẬP NHẬT (Nếu có API Update Account) ---
        // Hiện tại authService chưa thấy hàm updateAccount,
        // nếu chỉ update UserInfo thì gọi updateUserInfo.
        // Tạm thời giả lập thành công hoặc gọi API nếu bạn đã thêm.

        // Ví dụ gọi update user info:
        // await authService.updateUserInfo(userToEdit.id, { fullName: form.name });

        // Hoặc gọi API lock/unlock nếu đổi status

        showToast({
          title: "Thành công",
          message: "Cập nhật thành công",
          type: "success",
        });
      } else {
        // --- LOGIC TẠO MỚI ---
        await authService.createUser({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role, // 'user' hoặc 'admin'
        });

        showToast({
          title: "Thành công",
          message: "Đã tạo tài khoản mới",
          type: "success",
        });
      }

      onSaveSuccess(); // Refresh list và đóng modal
    } catch (error) {
      const msg = error.response?.data?.message || "Có lỗi xảy ra";
      showToast({ title: "Lỗi", message: msg, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Cập nhật tài khoản" : "Thêm tài khoản mới"}
    >
      <div className={styles.modalBody}>
        <form onSubmit={handleSubmit}>
          {/* HỌ TÊN */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Họ và tên (Account Name)</label>
            <input
              type="text"
              className={styles.formControl}
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* EMAIL (Readonly khi sửa) */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Email</label>
            <input
              type="email"
              className={styles.formControl}
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              readOnly={isEdit}
              style={isEdit ? { backgroundColor: "#f0f0f0" } : {}}
            />
          </div>

          {/* MẬT KHẨU (Chỉ hiện khi tạo mới) */}
          {!isEdit && (
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Mật khẩu</label>
              <input
                type="password"
                className={styles.formControl}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>
          )}

          {/* ROLE SELECTION */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Vai trò</label>
            <select
              className={styles.formControl}
              name="role"
              value={form.role}
              onChange={handleChange}
              disabled={isEdit} // Thường không cho sửa Role sau khi tạo (tùy logic)
            >
              <option value="user">Khách hàng (USER)</option>
              <option value="admin">Quản trị viên (ADMIN)</option>
            </select>
          </div>

          {/* STATUS (Chỉ hiện khi sửa) */}
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
