import React, { useState, useEffect } from "react";
import { useToast } from "../../../../context/ToastContext";
import CommonModal from "./CommonModal";
import styles from "./CustomerModal.module.scss";

// Import hook mới
import { useUserInfo } from "../../../../context/FilterProvider";

const CustomerModal = ({ isOpen, onClose, customerToEdit, onSaveSuccess }) => {
  const { showToast } = useToast();
  const isEditMode = !!customerToEdit;

  // === 1. GỌI HOOK USER INFO ===
  const {
    data: userInfoListData, // Dữ liệu trả về LUÔN LÀ MẢNG
    isLoading: isLoadingUserInfo,
  } = useUserInfo(isEditMode ? customerToEdit.id : null);

  // === 2. TÁCH STATE: Form (Account) và List (User-Info) ===
  const [formData, setFormData] = useState({
    accountName: "",
    email: "",
    password: "",
    status: true,
  });
  const [userInfoList, setUserInfoList] = useState([]); // Khởi tạo mảng rỗng
  const [errors, setErrors] = useState({});

  // === 3. SỬA USEEFFECT: Đổ data vào 2 state riêng biệt ===
  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        // 3.1. Đổ data Account vào Form
        setFormData({
          accountName: customerToEdit.accountName,
          email: customerToEdit.email,
          status: customerToEdit.status,
          password: "",
        });

        // 3.2. Đổ data User-Info (MẢNG) vào List
        if (userInfoListData) {
          setUserInfoList(userInfoListData); // Gán mảng [ ... ]
        } else {
          setUserInfoList([]); // Gán mảng rỗng
        }
      } else {
        // 3.3. Reset form (Thêm mới)
        setFormData({
          accountName: "",
          email: "",
          password: "",
          status: true,
        });
        setUserInfoList([]);
      }
      setErrors({});
    }
  }, [customerToEdit, userInfoListData, isOpen, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (e) => {
    setFormData((prev) => ({ ...prev, status: e.target.checked }));
  };

  // === 4. VALIDATE (Giữ nguyên) ===
  const validate = () => {
    let tempErrors = {};
    if (!formData.accountName || formData.accountName.length < 3) {
      tempErrors.accountName = "Tên tài khoản phải lớn hơn 3 kí tự";
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      tempErrors.email = "Email không hợp lệ";
    }
    if (!isEditMode && (!formData.password || formData.password.length < 6)) {
      tempErrors.password = "Mật khẩu phải lớn hơn 6 kí tự";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // === 5. HANDLESUBMIT (Giữ nguyên) ===
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast({
        title: "Lỗi",
        message: "Vui lòng kiểm tra lại thông tin",
        type: "warning",
      });
      return;
    }
    showToast({
      title: "Chưa hỗ trợ",
      message: "API để Thêm/Sửa Account chưa được cung cấp.",
      type: "info",
    });
    onClose();
  };

  const title = isEditMode ? "CHỈNH SỬA TÀI KHOẢN" : "THÊM TÀI KHOẢN MỚI";

  // === 6. JSX (Giữ nguyên - Giờ sẽ không lỗi) ===
  return (
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      customWidth="600px"
    >
      <div className={styles.formContent}>
        {/* === DANH SÁCH USER-INFO (Chỉ đọc) === */}
        {isEditMode && (
          <div className={styles.userInfoListContainer}>
            <h4 className={styles.listTitle}>Danh sách thông tin liên hệ</h4>
            {isLoadingUserInfo ? (
              <p>Đang tải thông tin liên hệ...</p>
            ) : userInfoList.length === 0 ? (
              <p className={styles.noInfo}>
                Tài khoản này chưa có thông tin liên hệ nào.
              </p>
            ) : (
              // Chỗ này sẽ không lỗi nữa, vì userInfoList luôn là mảng
              userInfoList.map((info) => (
                <div key={info.id} className={styles.userInfoItem}>
                  <div className={styles.infoRow}>
                    <i className="fa-regular fa-user"></i>
                    <strong>{info.fullName}</strong>
                    <span className={styles.gender}>({info.gender})</span>
                  </div>
                  <div className={styles.infoRow}>
                    <i className="fa-regular fa-phone"></i>
                    <span>{info.phoneNumber}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <i className="fa-regular fa-location-dot"></i>
                    <span>{info.address}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* === FORM CHỈNH SỬA ACCOUNT === */}
        <form className={styles.signupForm} onSubmit={handleSubmit}>
          {/* ... (Các trường input: accountName, email, password) ... */}
          <div className={styles.formGroup}>
            <label htmlFor="accountName" className={styles.formLabel}>
              Tên Tài Khoản
            </label>
            <input
              id="accountName"
              name="accountName"
              type="text"
              placeholder="VD: nguyenvan_a"
              className={styles.formControl}
              value={formData.accountName}
              onChange={handleChange}
            />
            {errors.accountName && (
              <span className={styles.formMessage}>{errors.accountName}</span>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.formLabel}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="VD: example@gmail.com"
              className={styles.formControl}
              value={formData.email}
              onChange={handleChange}
              disabled={isEditMode}
            />
            {errors.email && (
              <span className={styles.formMessage}>{errors.email}</span>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.formLabel}>
              Mật khẩu
            </label>
            <input
              id="password"
              name="password"
              type="text"
              placeholder={
                isEditMode ? "Bỏ trống nếu không đổi" : "Nhập mật khẩu"
              }
              className={styles.formControl}
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <span className={styles.formMessage}>{errors.password}</span>
            )}
          </div>

          {isEditMode && (
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Trạng thái</label>
              <input
                type="checkbox"
                id="user-status"
                className={styles.switchInput} // Đã sửa class
                checked={formData.status}
                onChange={handleStatusChange}
              />
              <label
                htmlFor="user-status"
                className={styles.switchLabel} // Đã sửa class
              ></label>
            </div>
          )}

          <button type="submit" className={styles.formSubmit}>
            {isEditMode ? "Lưu thông tin" : "Tạo tài khoản"}
          </button>
        </form>
      </div>
    </CommonModal>
  );
};

export default CustomerModal;
