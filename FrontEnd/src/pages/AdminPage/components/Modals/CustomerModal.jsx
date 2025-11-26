import React, { useState, useEffect } from "react";
import { useToast } from "../../../../context/ToastContext";
import CommonModal from "./CommonModal";
import styles from "./CustomerModal.module.scss";
import { useUserDetail, useSaveUser } from "../../../../context/FilterProvider";

const initialFormData = {
  id: null,
  fullName: "",
  email: "",
  password: "",
  phoneNumber: "",
  address: "",
  status: true,
};

const CustomerModal = ({ isOpen, onClose, customerToEdit, onSaveSuccess }) => {
  const { showToast } = useToast();
  const isEditMode = !!customerToEdit;
  const customerId = customerToEdit?.id;

  const { data: userDetail, isLoading: isLoadingDetail } = useUserDetail(
    isEditMode ? customerId : null
  );
  const { mutateAsync: saveUser, isPending: isSaving } = useSaveUser();

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        setFormData({
          id: customerToEdit.id,
          fullName: customerToEdit.fullName || "",
          email: customerToEdit.email || "",
          password: "",
          phoneNumber: customerToEdit.phoneNumber || "",
          address: customerToEdit.address || "",
          status: customerToEdit.status ?? true,
        });
      } else {
        setFormData(initialFormData);
      }
      setErrors({});
    }
  }, [isOpen, customerToEdit, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (e) => {
    setFormData((prev) => ({ ...prev, status: e.target.checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email) {
      setErrors({
        fullName: !formData.fullName ? "Vui lòng nhập tên" : "",
        email: !formData.email ? "Vui lòng nhập email" : "",
      });
      return;
    }

    try {
      const payload = {
        id: formData.id,
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        status: formData.status,
        // QUAN TRỌNG: Gán cứng role là User
        userType: 0,
        role: "USER",
      };

      if (formData.password) {
        payload.password = formData.password;
      } else if (!isEditMode) {
        // Nếu tạo mới mà không nhập pass -> set mặc định hoặc báo lỗi
        // Ở đây set mặc định cho nhanh
        payload.password = "123456";
      }

      await saveUser(payload, {
        variables: payload,
      });

      onSaveSuccess();
    } catch (error) {
      // Lỗi được xử lý bởi hook
    }
  };

  if (isEditMode && isLoadingDetail) {
    return (
      <CommonModal isOpen={isOpen} onClose={onClose} title="Loading...">
        <div
          className={styles.formContent}
          style={{ textAlign: "center", padding: "30px" }}
        >
          Đang tải chi tiết...
        </div>
      </CommonModal>
    );
  }

  return (
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Sửa thông tin khách hàng" : "Tạo khách hàng mới"}
      customWidth="600px"
    >
      <div className={styles.formContent}>
        <form className={styles.signupForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Tên đầy đủ *</label>
            <input
              name="fullName"
              type="text"
              placeholder="Nhập tên đầy đủ"
              className={styles.formControl}
              value={formData.fullName}
              onChange={handleChange}
            />
            {errors.fullName && (
              <span className={styles.formMessage}>{errors.fullName}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Email *</label>
            <input
              name="email"
              type="email"
              placeholder="Nhập email"
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
            <label className={styles.formLabel}>Số điện thoại</label>
            <input
              name="phoneNumber"
              type="text"
              placeholder="Nhập số điện thoại"
              className={styles.formControl}
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Địa chỉ</label>
            <input
              name="address"
              type="text"
              placeholder="Nhập địa chỉ"
              className={styles.formControl}
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Mật khẩu {isEditMode ? "(Bỏ trống nếu không đổi)" : "*"}
            </label>
            <input
              name="password"
              type="text"
              placeholder="Nhập mật khẩu"
              className={styles.formControl}
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* TRẠNG THÁI (Chỉ hiển thị khi Edit) */}
          {isEditMode && (
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Trạng thái</label>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "5px",
                }}
              >
                {/* CẤU TRÚC MỚI: Wrapper -> Input -> Slider (Span) */}
                <label className={styles.switchWrapper}>
                  <input
                    type="checkbox"
                    checked={formData.status}
                    onChange={handleStatusChange}
                  />
                  <span className={styles.switchSlider}></span>
                </label>

                <span
                  style={{
                    fontWeight: "600",
                    color: formData.status ? "var(--red)" : "#777",
                    fontSize: "14px",
                  }}
                >
                  {formData.status ? "Hoạt động" : "Đã khóa"}
                </span>
              </div>
            </div>
          )}

          {isEditMode && userDetail && (
            <div className={styles.userInfoListContainer}>
              <h4 className={styles.listTitle}>Thông tin bổ sung</h4>
              <div className={styles.userInfoItem}>
                <p>
                  <strong>Tổng số đơn hàng:</strong>{" "}
                  {userDetail.ordersCount || 0}
                </p>
              </div>
            </div>
          )}

          <button
            type="submit"
            className={styles.formSubmit}
            disabled={isSaving}
          >
            {isSaving ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <i className="fa-regular fa-floppy-disk"></i>
            )}
            {isEditMode ? " Lưu thay đổi" : " Tạo tài khoản"}
          </button>
        </form>
      </div>
    </CommonModal>
  );
};

export default CustomerModal;
