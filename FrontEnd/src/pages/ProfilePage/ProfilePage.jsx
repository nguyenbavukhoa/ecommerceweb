// src/pages/ProfilePage/ProfilePage.jsx
import React, { useState } from "react";
import styles from "./ProfilePage.module.css";
import AccountInfo from "./AccountInfo";
import Modal from "../../components/common/Modal";
import ProfileContent from "./ProfileContent";
import DeliveryAddress from "../../components/DeliveryAddress/DeliveryAddress";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext"; // [MỚI] Import Toast

const ProfilePage = () => {
  const { auth: user, updateProfile } = useAuth();
  const { showToast } = useToast(); // [MỚI]

  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState(null);

  const handleProfileUpdate = async (updatedData) => {
    try {
      // Gọi hàm updateProfile từ AuthContext (đã viết ở bước trước)
      await updateProfile(updatedData);

      showToast({
        title: "Thành công",
        message: "Cập nhật hồ sơ thành công!",
        type: "success",
      });

      setIsInfoModalOpen(false);
    } catch (error) {
      console.error("Lỗi cập nhật profile:", error);
      showToast({
        title: "Lỗi",
        message: "Cập nhật thất bại. Vui lòng thử lại.",
        type: "error",
      });
    }
  };

  if (!user)
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        Vui lòng đăng nhập để xem hồ sơ.
      </div>
    );

  return (
    <div className={styles.profilePageWrapper}>
      <div className={styles.profilePage}>
        {/* Block 1: Thông tin tài khoản */}
        <div className={styles.checkoutRow}>
          <div className={styles.checkoutColTitle}>Thông tin tài khoản</div>
          <div className={styles.contentPadding}>
            <AccountInfo user={user} onEdit={() => setIsInfoModalOpen(true)} />
          </div>
        </div>

        {/* Block 2: Sổ địa chỉ */}
        {/* Lưu ý: DeliveryAddress cần tự xử lý logic fetch/save với API mới */}
        <div className={styles.checkoutRow}>
          <div className={styles.checkoutColTitle}>Sổ địa chỉ nhận hàng</div>
          <div className={styles.contentPadding}>
            <DeliveryAddress onAddressChange={setDeliveryInfo} />
          </div>
        </div>
      </div>

      {/* Modal Chỉnh sửa */}
      <Modal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)}>
        {/* Truyền user vào để form có dữ liệu ban đầu */}
        <ProfileContent user={user} onSave={handleProfileUpdate} />
      </Modal>
    </div>
  );
};

export default ProfilePage;
