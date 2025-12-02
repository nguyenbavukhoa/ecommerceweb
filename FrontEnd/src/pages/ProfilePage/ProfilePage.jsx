// src/pages/ProfilePage/ProfilePage.jsx
import React, { useState } from "react";
import styles from "./ProfilePage.module.css";
import AccountInfo from "./AccountInfo";
import Modal from "../../components/common/Modal";
import ProfileContent from "./ProfileContent";
import DeliveryAddress from "../../components/DeliveryAddress/DeliveryAddress";
import { useAuth } from "../../context/AuthContext"; // Import AuthContext

const ProfilePage = () => {
  const { auth: user, updateProfile } = useAuth(); // Lấy user thực tế
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState(null);

  const handleProfileUpdate = async (updatedData) => {
    // Gọi hàm updateProfile từ AuthContext (đã viết ở bước trước)
    // Hàm này sẽ cập nhật cả LocalStorage và Mock DB
    await updateProfile(updatedData);
    setIsInfoModalOpen(false);
  };

  if (!user)
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        Vui lòng đăng nhập.
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
        <div className={styles.checkoutRow}>
          <div className={styles.checkoutColTitle}>Sổ địa chỉ nhận hàng</div>
          <div className={styles.contentPadding}>
            <DeliveryAddress onAddressChange={setDeliveryInfo} />
          </div>
        </div>
      </div>

      {/* Modal Chỉnh sửa */}
      <Modal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)}>
        <ProfileContent user={user} onSave={handleProfileUpdate} />
      </Modal>
    </div>
  );
};

export default ProfilePage;
