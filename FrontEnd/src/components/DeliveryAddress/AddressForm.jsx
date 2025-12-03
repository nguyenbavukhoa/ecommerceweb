// src/components/DeliveryAddress/AddressForm.jsx
import React, { useState } from "react";
import styles from "./AddressForm.module.css";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";

const AddressForm = ({ initialData = {}, onSave, onCancel }) => {
  const { showToast } = useToast();
  const { auth: currentUser } = useAuth();

  const isEditing = !!initialData.id;

  // --- LOGIC KHỞI TẠO STATE ---
  // Nếu đang sửa (initialData có value) -> Dùng initialData
  // Nếu thêm mới -> Dùng thông tin user (nếu có) để điền sẵn cho tiện
  const defaultName =
    initialData.name ||
    (currentUser ? currentUser.fullName || currentUser.accountName : "");
  // Thông tin user có thể không có sđt, nên cần check kỹ
  const defaultPhone =
    initialData.phone || (currentUser ? currentUser.phoneNumber : "") || "";

  const [name, setName] = useState(defaultName);
  const [phone, setPhone] = useState(defaultPhone);
  const [address, setAddress] = useState(initialData.address || "");
  const [type, setType] = useState(initialData.type || "HOME");
  const [customName, setCustomName] = useState(initialData.customName || "");
  const [driverNote, setDriverNote] = useState(initialData.driverNote || "");

  const mapTypeToGender = (type) => {
    // Cần hàm này cho việc gọi API
    if (type === "HOME") return "MALE"; // Giả định HOME = MALE
    if (type === "WORK") return "FEMALE"; // Giả định WORK = FEMALE
    return "OTHER";
  };

  // --- XỬ LÝ LƯU ---
  const handleSave = () => {
    // --- B1: Validation cơ bản ---
    if (!name || !phone || !address) {
      showToast({
        title: "Lỗi",
        message: "Vui lòng nhập đủ thông tin bắt buộc: Tên, SĐT, Địa chỉ.",
        type: "error",
      });
      return;
    }

    // --- B2: Chuẩn bị dữ liệu ---
    const dataToSave = {
      // [QUAN TRỌNG NHẤT] Giữ lại ID nếu đang SỬA, hoặc là null nếu THÊM MỚI
      id: initialData.id || null,

      fullName: name,
      phoneNumber: phone,
      address: address,

      // Map Type sang Gender theo yêu cầu API
      gender: mapTypeToGender(type),

      // Các trường phụ
      type: type,
      customName: type === "OTHER" ? customName : null,
      driverNote: driverNote,
    };

    // B3: Gọi callback
    onSave(dataToSave);
  };

  // --- RENDER GIAO DIỆN (GIỮ NGUYÊN) ---
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
          {isEditing ? "Cập nhật" : "Lưu địa chỉ"}
        </button>
      </div>
    </div>
  );
};

export default AddressForm;
