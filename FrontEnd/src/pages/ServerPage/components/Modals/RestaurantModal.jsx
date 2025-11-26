import React, { useState, useEffect } from "react";
import CommonModal from "../../../AdminPage/components/Modals/CommonModal";
import { useToast } from "../../../../context/ToastContext";
// Import hooks mới
import {
  useCreateStore,
  useUpdateStore,
} from "../../../../context/FilterProvider";
import styles from "./RestaurantModal.module.scss";

const RestaurantModal = ({ isOpen, onClose, restaurant, onSaveSuccess }) => {
  const { showToast } = useToast();
  const isEdit = !!restaurant;

  // Gọi Hooks Mutation
  const createStoreMutation = useCreateStore();
  const updateStoreMutation = useUpdateStore();

  const [form, setForm] = useState({
    name: "",
    owner: "",
    phone: "",
    email: "",
    address: "",
    status: "active",
    // Thêm toạ độ mặc định (Quận 1) nếu chưa có map picker
    location: [10.776019, 106.702068],
  });

  useEffect(() => {
    if (isOpen) {
      if (isEdit) {
        setForm({
          name: restaurant.name || "",
          owner: restaurant.owner || "",
          phone: restaurant.phone || "",
          email: restaurant.email || "",
          address: restaurant.address || "",
          status: restaurant.status || "active",
          location: restaurant.location || [10.776019, 106.702068],
        });
      } else {
        // Reset form khi thêm mới
        setForm({
          name: "",
          owner: "",
          phone: "",
          email: "",
          address: "",
          status: "active",
          location: [10.776019, 106.702068],
        });
      }
    }
  }, [isOpen, isEdit, restaurant]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.address) {
      showToast("warning", "Vui lòng nhập tên, sđt và địa chỉ.");
      return;
    }

    try {
      if (isEdit) {
        // UPDATE
        await updateStoreMutation.mutateAsync({
          id: restaurant.id,
          data: form,
        });
      } else {
        // CREATE
        await createStoreMutation.mutateAsync(form);
      }

      onSaveSuccess(); // Đóng modal
    } catch (error) {
      // Lỗi đã được xử lý trong hook (onError)
    }
  };

  const isLoading =
    createStoreMutation.isPending || updateStoreMutation.isPending;

  return (
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "CHỈNH SỬA NHÀ HÀNG" : "THÊM NHÀ HÀNG MỚI"}
      customWidth="600px"
    >
      <div className={styles.formContent}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Tên nhà hàng</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={styles.input}
              placeholder="VD: KHK Food Quận 1"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Địa chỉ</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Số điện thoại</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Chủ sở hữu</label>
              <input
                type="text"
                name="owner"
                value={form.owner}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Email (Đăng nhập)</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Trạng thái</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Tạm ngưng</option>
                <option value="pending">Chờ duyệt</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? "Đang lưu..." : isEdit ? "Lưu thay đổi" : "Tạo mới"}
          </button>
        </form>
      </div>
    </CommonModal>
  );
};

export default RestaurantModal;
