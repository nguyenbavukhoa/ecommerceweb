// src/pages/AdminPage/sections/StoreSetting/StoreSetting.jsx
import React, { useState, useEffect } from "react";
import { useToast } from "../../../../context/ToastContext";
// [MỚI] Thêm hook useUpdateStore
import {
  useStoreInfo,
  useUpdateStore,
} from "../../../../context/FilterProvider";
import styles from "./StoreSetting.module.scss";

const StoreSetting = ({ storeId }) => {
  // Nhận storeId từ props cha
  const { showToast } = useToast();

  // 1. Hook lấy dữ liệu và hook update
  const { data: storeData, isLoading, error } = useStoreInfo(storeId);
  const updateStoreMutation = useUpdateStore();

  const [store, setStore] = useState({
    name: "",
    address: "",
    phone: "",
    description: "",
    openTime: "08:00",
    closeTime: "22:00",
    isOpen: true,
    avatar: "",
  });

  useEffect(() => {
    if (storeData) {
      setStore({
        name: storeData.name || "",
        address: storeData.address || "",
        phone: storeData.phone || "",
        description: storeData.description || "",
        openTime: storeData.openTime || "08:00",
        closeTime: storeData.closeTime || "22:00",
        isOpen: storeData.isOpen !== undefined ? storeData.isOpen : true,
        avatar: storeData.avatar || "",
      });
    }
  }, [storeData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStore((prev) => ({ ...prev, [name]: value }));
  };

  const toggleOpen = () => {
    setStore((prev) => ({ ...prev, isOpen: !prev.isOpen }));
  };

  // [SỬA] Gọi API Update
  const handleSave = () => {
    updateStoreMutation.mutate(
      { id: storeId, data: store },
      {
        onSuccess: () => {
          // Toast đã được handle trong hook useUpdateStore, không cần gọi lại ở đây
        },
      }
    );
  };

  const handleCloseRequest = () => {
    if (window.confirm("Bạn có chắc muốn gửi yêu cầu đóng quán vĩnh viễn?")) {
      showToast({
        title: "Đã gửi",
        message: "Yêu cầu đóng quán đã được gửi tới Admin.",
        type: "info",
      });
    }
  };

  if (isLoading)
    return (
      <div className={styles.section}>
        <p>Đang tải thông tin...</p>
      </div>
    );
  if (error)
    return (
      <div className={styles.section}>
        <p>Lỗi: {error.message}</p>
      </div>
    );

  return (
    <div className={styles.section}>
      <div className={styles.settingCard}>
        <div className={styles.header}>
          <h2>⚙️ Cài đặt quán</h2>
          <p className={styles.hint}>
            Cập nhật thông tin hiển thị, giờ hoạt động và trạng thái của quán.
          </p>
        </div>

        <div className={styles.formGroup}>
          <label>Tên quán</label>
          <input
            type="text"
            name="name"
            value={store.name}
            onChange={handleChange}
            placeholder="Nhập tên quán..."
          />
        </div>

        <div className={styles.formGroup}>
          <label>Địa chỉ</label>
          <input
            type="text"
            name="address"
            value={store.address}
            onChange={handleChange}
            placeholder="Nhập địa chỉ..."
          />
        </div>

        <div className={styles.formGroup}>
          <label>Số điện thoại</label>
          <input
            type="text"
            name="phone"
            value={store.phone}
            onChange={handleChange}
            placeholder="Nhập số điện thoại..."
          />
        </div>

        <div className={styles.formGroup}>
          <label>Mô tả</label>
          <textarea
            name="description"
            value={store.description}
            onChange={handleChange}
            placeholder="Giới thiệu đôi chút về quán..."
          ></textarea>
        </div>

        <div className={styles.row}>
          <div className={`${styles.col} ${styles.formGroup}`}>
            <label>Giờ mở cửa</label>
            <input
              type="time"
              name="openTime"
              value={store.openTime}
              onChange={handleChange}
            />
          </div>
          <div className={`${styles.col} ${styles.formGroup}`}>
            <label>Giờ đóng cửa</label>
            <input
              type="time"
              name="closeTime"
              value={store.closeTime}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.statusRow}>
          <label>Trạng thái hoạt động:</label>
          <button
            className={`${styles.btnStatus} ${
              store.isOpen ? styles.open : styles.close
            }`}
            onClick={toggleOpen}
          >
            {store.isOpen ? "🟢 Đang mở cửa" : "🔴 Tạm đóng"}
          </button>
        </div>

        <div className={styles.formGroup}>
          <label>Ảnh đại diện</label>
          <div className={styles.avatarBox}>
            <img
              src={store.avatar || "assets/img/favicon.png"}
              alt="Avatar"
              onError={(e) => (e.target.src = "assets/img/favicon.png")}
            />
            <input
              type="text"
              name="avatar"
              value={store.avatar}
              onChange={handleChange}
              placeholder="Dán đường dẫn ảnh (URL) vào đây..."
            />
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.deactivateBtn} onClick={handleCloseRequest}>
            Gửi yêu cầu đóng quán vĩnh viễn
          </button>
          <button
            className={styles.saveBtn}
            onClick={handleSave}
            disabled={updateStoreMutation.isPending} // Disable khi đang lưu
          >
            {updateStoreMutation.isPending ? (
              "Đang lưu..."
            ) : (
              <>
                <i className="fa-regular fa-floppy-disk"></i> Lưu thay đổi
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreSetting;
