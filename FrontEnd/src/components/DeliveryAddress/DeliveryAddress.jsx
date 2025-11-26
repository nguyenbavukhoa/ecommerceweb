// src/components/DeliveryAddress/DeliveryAddress.jsx
import React, { useState, useEffect } from "react";
import Modal from "../common/Modal";
import AddressEditView from "./AddressEditView";
import AddressForm from "./AddressForm";
import styles from "./DeliveryAddress.module.css";
// 1. Import AuthContext để lấy user và hàm updateProfile
import { useAuth } from "../../context/AuthContext";

const DeliveryAddress = ({ onAddressChange }) => {
  // 2. Lấy hàm updateProfile thay vì dùng useSaveUser
  const { auth: currentUser, updateProfile } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Load Address ---
  useEffect(() => {
    if (currentUser) {
      const userAddresses = currentUser.addresses || [];
      setAddresses(userAddresses);

      // Chọn mặc định
      const defaultAddr =
        userAddresses.find((addr) => addr.isDefault) || userAddresses[0];
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
      } else {
        setSelectedAddressId(null);
      }
    } else {
      setAddresses([]);
      setSelectedAddressId(null);
    }
    setLoading(false);
  }, [currentUser]);

  const selectedAddress = addresses.find(
    (addr) => addr.id === selectedAddressId
  );

  useEffect(() => {
    if (onAddressChange && selectedAddress) {
      onAddressChange(selectedAddress);
    }
  }, [selectedAddress, onAddressChange]);

  // --- Helper: Cập nhật DB & Session ---
  const updateAddressesInDB = async (newAddressList) => {
    if (!currentUser) return;
    try {
      // Gọi updateProfile của AuthContext.
      // Hàm này sẽ:
      // 1. Cập nhật State Auth
      // 2. Cập nhật LocalStorage 'auth'
      // 3. Cập nhật LocalStorage 'db_users'
      await updateProfile({
        addresses: newAddressList,
      });

      // UI tự động update nhờ useEffect lắng nghe currentUser
    } catch (error) {
      console.error("Lỗi lưu địa chỉ:", error);
    }
  };

  // --- Xử lý Thêm mới ---
  const handleSaveNewAddress = async (newAddressData) => {
    const newId = Date.now();
    const isFirst = addresses.length === 0;

    const savedAddress = {
      ...newAddressData,
      id: newId,
      isDefault: isFirst || newAddressData.isDefault,
    };

    let updatedList;
    if (savedAddress.isDefault && !isFirst) {
      updatedList = addresses.map((a) => ({ ...a, isDefault: false }));
      updatedList = [savedAddress, ...updatedList];
    } else {
      updatedList = [savedAddress, ...addresses];
    }

    await updateAddressesInDB(updatedList);
    setSelectedAddressId(newId);
    setIsModalOpen(false);
  };

  // --- Xử lý Cập nhật ---
  const handleUpdateAddress = async (updatedAddressData) => {
    let updatedList = addresses.map((addr) =>
      addr.id === updatedAddressData.id ? updatedAddressData : addr
    );

    if (updatedAddressData.isDefault) {
      updatedList = updatedList.map((addr) =>
        addr.id === updatedAddressData.id ? addr : { ...addr, isDefault: false }
      );
    }

    await updateAddressesInDB(updatedList);
  };

  const handleSelectAddress = (id) => {
    setSelectedAddressId(id);
    setIsModalOpen(false);
  };

  // ... (Phần render UI giữ nguyên như code cũ) ...
  if (loading) return <div className={styles.loading}>Đang tải địa chỉ...</div>;

  if (!selectedAddress) {
    // ... (Render state trống)
    return (
      <div className={styles.addressContainer}>
        <div
          className={styles.selectedAddressDisplay}
          style={{ justifyContent: "center", borderStyle: "dashed" }}
        >
          <button
            className={styles.editBtn}
            onClick={() => setIsModalOpen(true)}
            style={{ margin: 0 }}
          >
            + Thêm địa chỉ nhận hàng mới
          </button>
        </div>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <AddressModalContent
            addresses={addresses}
            selectedAddress={null}
            onSelectAddress={handleSelectAddress}
            onSaveNewAddress={handleSaveNewAddress}
            onUpdateAddress={handleUpdateAddress}
            onClose={() => setIsModalOpen(false)}
          />
        </Modal>
      </div>
    );
  }

  return (
    <div className={styles.addressContainer}>
      <div className={styles.selectedAddressDisplay}>
        <div className={styles.selectedIcon}>
          <i className="fa-light fa-location-dot"></i>
        </div>
        <div className={styles.selectedDetails}>
          <p className={styles.addressText}>{selectedAddress.address}</p>
          <p className={styles.namePhone}>
            <span>{selectedAddress.name}</span>
            <span>{selectedAddress.phone}</span>
          </p>
        </div>
        <button className={styles.editBtn} onClick={() => setIsModalOpen(true)}>
          Thay đổi
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddressModalContent
          addresses={addresses}
          selectedAddress={selectedAddress}
          onSelectAddress={handleSelectAddress}
          onSaveNewAddress={handleSaveNewAddress}
          onUpdateAddress={handleUpdateAddress}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

// ... (AddressModalContent giữ nguyên) ...
const AddressModalContent = ({
  addresses,
  selectedAddress,
  onSelectAddress,
  onSaveNewAddress,
  onUpdateAddress,
  onClose,
}) => {
  const [view, setView] = useState("list");
  const [addressToEdit, setAddressToEdit] = useState(null);

  const handleGoToEdit = (address) => {
    setAddressToEdit(address);
    setView("editing");
  };

  const handleGoToAdd = () => {
    setAddressToEdit(null);
    setView("adding");
  };

  const handleSaveUpdate = (updatedData) => {
    onUpdateAddress(updatedData);
    setView("list");
  };

  if (view === "adding") {
    return (
      <AddressForm onSave={onSaveNewAddress} onCancel={() => setView("list")} />
    );
  }

  if (view === "editing") {
    return (
      <AddressForm
        initialData={addressToEdit}
        onSave={handleSaveUpdate}
        onCancel={() => setView("list")}
      />
    );
  }

  return (
    <AddressEditView
      addresses={addresses}
      selectedAddress={selectedAddress}
      onSelectAddress={onSelectAddress}
      onAddNew={handleGoToAdd}
      onEditAddress={handleGoToEdit}
      onCancel={onClose}
    />
  );
};

export default DeliveryAddress;
