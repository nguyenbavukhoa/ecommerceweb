// src/components/DeliveryAddress/AddressForm.jsx
import React, { useState } from "react";
import styles from "./AddressForm.module.css";
import { useToast } from "../../context/ToastContext";
// 1. Import AuthContext
import { useAuth } from "../../context/AuthContext";

const AddressForm = ({ initialData = {}, onSave, onCancel }) => {
  const { showToast } = useToast();

  // 2. Lấy thông tin user hiện tại
  const { auth: currentUser } = useAuth();

  const isEditing = !!initialData.id;

  // 3. Logic khởi tạo state: Ưu tiên initialData (nếu sửa), nếu không thì lấy từ currentUser (nếu thêm mới)
  const [name, setName] = useState(
    initialData.name ||
      (currentUser ? currentUser.fullName || currentUser.accountName : "")
  );
  const [phone, setPhone] = useState(
    initialData.phone || (currentUser ? currentUser.phone : "")
  );

  const [address, setAddress] = useState(initialData.address || "");
  const [type, setType] = useState(initialData.type || "HOME");
  const [customName, setCustomName] = useState(initialData.customName || "");
  const [driverNote, setDriverNote] = useState(initialData.driverNote || "");

  const handleSave = () => {
    // ... (Phần validate và logic save giữ nguyên như cũ) ...
    if (!name.trim()) {
      showToast({
        title: "Thông tin trống",
        message: "Vui lòng nhập họ và tên.",
        type: "warning",
      });
      return;
    }
    if (!phone.trim()) {
      showToast({
        title: "Thông tin trống",
        message: "Vui lòng nhập số điện thoại.",
        type: "warning",
      });
      return;
    }
    if (!address.trim()) {
      showToast({
        title: "Thông tin trống",
        message: "Vui lòng nhập địa chỉ.",
        type: "warning",
      });
      return;
    }
    if (type === "OTHER" && !customName.trim()) {
      showToast({
        title: "Thông tin trống",
        message: "Vui lòng nhập tên cho loại địa chỉ 'Khác'.",
        type: "warning",
      });
      return;
    }

    onSave({
      ...initialData,
      name,
      phone,
      address,
      type,
      customName: type === "OTHER" ? customName : null,
      driverNote,
    });
  };

  return (
    <div className={`${styles.addForm} ${styles.addressListWrapper}`}>
      <div className={styles.editHeader}>
        <button onClick={onCancel} className={styles.backBtn}>
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h3>{isEditing ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}</h3>
      </div>

      <p className={styles.typeInfo}>Tên:</p>
      <input
        type="text"
        placeholder="Tên người nhận"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={styles.formInput}
      />

      <p className={styles.typeInfo}>Số điện thoại:</p>
      <input
        type="text"
        placeholder="Số điện thoại"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className={styles.formInput}
      />

      <p className={styles.typeInfo}>Địa chỉ:</p>
      <input
        type="text"
        placeholder="Địa chỉ (số nhà, tên đường, phường/xã,...)"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className={styles.formInput}
      />

      <div className={styles.addressTypeSelection}>
        <p className={styles.typeInfo}>Loại địa chỉ:</p>
        <div className={styles.typeButtonContainer}>
          <button
            type="button"
            className={`${styles.typeButton} ${
              type === "HOME" ? styles.active : ""
            }`}
            onClick={() => setType("HOME")}
          >
            <i className="fa-solid fa-house"></i> Nhà
          </button>
          <button
            type="button"
            className={`${styles.typeButton} ${
              type === "WORK" ? styles.active : ""
            }`}
            onClick={() => setType("WORK")}
          >
            <i className="fa-solid fa-briefcase"></i> Công ty
          </button>
          <button
            type="button"
            className={`${styles.typeButton} ${
              type === "OTHER" ? styles.active : ""
            }`}
            onClick={() => setType("OTHER")}
          >
            <i className="fa-solid fa-tag"></i> Khác
          </button>
        </div>

        {type === "OTHER" && (
          <input
            type="text"
            placeholder="Nhập tên gợi nhớ (vd: Nhà bạn gái)"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className={`${styles.formInput} ${styles.customNameInput}`}
          />
        )}
      </div>

      <textarea
        placeholder="Ghi chú cho tài xế (không bắt buộc)"
        value={driverNote}
        onChange={(e) => setDriverNote(e.target.value)}
        className={`${styles.formInput} ${styles.driverNoteInput}`}
        rows="3"
      />

      <div className={styles.formActions}>
        <button onClick={handleSave} className={styles.saveBtn}>
          Lưu địa chỉ
        </button>
      </div>
    </div>
  );
};

export default AddressForm;
