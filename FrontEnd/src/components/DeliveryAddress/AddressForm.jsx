// src/components/DeliveryAddress/AddressForm.jsx
import React, { useState } from "react";
import styles from "./AddressForm.module.css";
import { useToast } from "../../context/ToastContext";
const AddressForm = ({ initialData = {}, onSave, onCancel }) => {
  const { showToast } = useToast(); // Kích hoạt hook
  const isEditing = !!initialData.id; // Kiểm tra xem đây là form sửa hay thêm mới

  const [name, setName] = useState(initialData.name || "");
  const [phone, setPhone] = useState(initialData.phone || "");
  const [address, setAddress] = useState(initialData.address || "");
  const [type, setType] = useState(initialData.type || "HOME");
  const [customName, setCustomName] = useState(initialData.customName || "");
  const [driverNote, setDriverNote] = useState(initialData.driverNote || ""); // Trường mới cho ghi chú tài xế

  const handleSave = () => {
    console.log("1. Nút Lưu đã được nhấn. Bắt đầu kiểm tra dữ liệu...");
    // --- Validation với Toast ---
    if (!name.trim()) {
      showToast({
        title: "Thông tin trống",
        message: "Vui lòng nhập họ và tên.",
        type: "warning",
      });
      //alert("Vui lòng nhập họ và tên."); // Giữ lại alert để fallback
      return;
    }
    if (!phone.trim()) {
      showToast({
        title: "Thông tin trống",
        message: "Vui lòng nhập số điện thoại.",
        type: "warning",
      });
      //alert("Vui lòng nhập số điện thoại.");
      return;
    }
    if (!address.trim()) {
      showToast({
        title: "Thông tin trống",
        message: "Vui lòng nhập địa chỉ.",
        type: "warning",
      });
      //alert("Vui lòng nhập địa chỉ.");
      return;
    }
    if (type === "OTHER" && !customName.trim()) {
      showToast({
        title: "Thông tin trống",
        message: "Vui lòng nhập tên cho loại địa chỉ 'Khác'.",
        type: "warning",
      });
      //alert("Vui lòng nhập tên cho loại địa chỉ 'Khác'.");
      return;
    }

    // ---- DEBUG: Thêm dòng log này ----
    console.log("2. Dữ liệu hợp lệ. Gọi hàm onSave() từ component cha.");

    onSave({
      ...initialData, // Giữ lại các thuộc tính cũ như id, isDefault
      name,
      phone,
      address,
      type,
      customName: type === "OTHER" ? customName : null,
      driverNote, // <-- Thêm trường mới vào object lưu trữ
    });
  };

  return (
    <div className={`${styles.addForm} ${styles.addressListWrapper}`}>
      {" "}
      {/* Reuse wrapper padding */}
      <div className={styles.editHeader}>
        <button onClick={onCancel} className={styles.backBtn}>
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h3>{isEditing ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}</h3>
      </div>
      <p className={styles.typeInfo}>Tên:</p>
      <input
        type="text"
        placeholder="Tên"
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
            type="button" // Quan trọng: ngăn button submit form
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

        {/* Input tên gợi nhớ vẫn hiển thị khi chọn 'Khác' */}
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
      {/* --- Note cho tài xế --- */}
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
        {/* <button onClick={onCancel}>Hủy</button> */}
      </div>
    </div>
  );
};

export default AddressForm;
