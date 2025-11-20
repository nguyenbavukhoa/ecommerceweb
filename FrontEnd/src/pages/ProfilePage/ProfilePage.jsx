// pages/ProfilePage/ProfilePage.jsx
import React, { useState } from "react";
import styles from "./ProfilePage.module.css";
import AccountInfo from "./AccountInfo";
import Modal from "../../components/common/Modal";
import ProfileContent from "./ProfileContent";
import DeliveryAddress from "../../components/DeliveryAddress/DeliveryAddress";

const mockUser = {
  name: "Trần Văn An",
  phone: "0987654321",
  email: "an.tv@example.com",
};

const ProfilePage = () => {
  const [user, setUser] = useState(mockUser);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const handleProfileUpdate = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
    setIsInfoModalOpen(false);
  };

  // State để nhận thông tin địa chỉ
  const [deliveryInfo, setDeliveryInfo] = useState(null); // State to receive selected address
  return (
    <div className={styles.profilePageWrapper}>
      <div className={styles.profilePage}>
        <div className={styles.checkoutRow}>
          <div className={styles.checkoutColTitle}>Thông tin tài khoản</div>
          <div className={styles.contentPadding}>
            <AccountInfo user={user} onEdit={() => setIsInfoModalOpen(true)} />
          </div>
        </div>

        <div className={styles.checkoutRow}>
          <div className={styles.checkoutColTitle}>Thông tin nhận hàng</div>
          <div className={styles.contentPadding}>
            <DeliveryAddress onAddressChange={setDeliveryInfo} />
          </div>
        </div>
      </div>

      <Modal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)}>
        <ProfileContent user={user} onSave={handleProfileUpdate} />
      </Modal>
    </div>
  );
};
export default ProfilePage;
