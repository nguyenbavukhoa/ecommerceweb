// src/components/DeliveryAddress/DeliveryAddress.jsx
import React, { useState, useEffect, useCallback } from "react";
import Modal from "../common/Modal";
import AddressEditView from "./AddressEditView"; // Import the new editing view
import AddressForm from "./AddressForm"; // Import the form
import styles from "./DeliveryAddress.module.css";
import { useToast } from "../../context/ToastContext";
// --- Dữ liệu mẫu (cập nhật nếu cần) ---
const mockUserAddresses = [
  {
    id: 1,
    name: "Trần Văn A",
    phone: "0909123456",
    address: "123 Đường A, Phường B, Quận C, TP. HCM",
    type: "HOME",
    isDefault: true,
  },
  {
    id: 2,
    name: "Văn phòng công ty",
    phone: "02838112233",
    address: "789 Đường D, Phường E, Quận G, TP. Thủ Đức",
    type: "WORK",
    isDefault: false,
  },
  {
    id: 3,
    name: "Nhà bạn gái",
    phone: "0987654321",
    address: "456 Chung cư X, Tòa Y, Phường Z, Quận 1, TP. HCM",
    type: "OTHER",
    customName: "Nhà bạn gái",
    isDefault: false,
  },
];

const DeliveryAddress = ({ onAddressChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addresses, setAddresses] = useState([]); // Start empty, fetch later
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for fetching addresses

  // --- API Placeholder: Fetch Addresses ---
  const fetchAddresses = useCallback(async () => {
    setLoading(true);
    // TODO: API Integration - Replace mock data with API call
    // Example: const response = await fetch('/api/user/addresses');
    // const data = await response.json();
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
    const fetchedAddresses = mockUserAddresses; // Use mock data for now
    setAddresses(fetchedAddresses);

    // Set default selected address after fetching
    const defaultAddr =
      fetchedAddresses.find((addr) => addr.isDefault) || fetchedAddresses[0];
    if (defaultAddr) {
      setSelectedAddressId(defaultAddr.id);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  // Find the currently selected address object
  const selectedAddress = addresses.find(
    (addr) => addr.id === selectedAddressId
  );

  // Notify parent component when selected address changes
  useEffect(() => {
    if (onAddressChange && selectedAddress) {
      onAddressChange(selectedAddress);
    }
  }, [selectedAddress, onAddressChange]);

  // --- API Placeholder: Save New Address ---
  const handleSaveNewAddress = async (newAddressData) => {
    // TODO: API Integration - Call API to save `newAddressData`
    // const response = await fetch('/api/user/addresses', { method: 'POST', body: JSON.stringify(newAddressData) });
    // const savedAddress = await response.json(); // Get the address with new ID from server

    const savedAddress = { ...newAddressData, id: Date.now() }; // Simulate save with local ID
    setAddresses((prev) => [savedAddress, ...prev]);
    setSelectedAddressId(savedAddress.id); // Switch back to display view after saving
    setIsModalOpen(false);
  };

  // --- API Placeholder: Update Address ---
  const handleUpdateAddress = async (updatedAddressData) => {
    // TODO: API Integration - Call API to update `updatedAddressData`
    // const response = await fetch(`/api/user/addresses/${updatedAddressData.id}`, { method: 'PUT', ... });
    setAddresses((prev) =>
      prev.map((addr) =>
        addr.id === updatedAddressData.id ? updatedAddressData : addr
      )
    );
    // Sau khi cập nhật, state của modal sẽ tự chuyển về list view, không cần đóng modal
  };

  const handleSelectAddress = (id) => {
    setSelectedAddressId(id);
    setIsModalOpen(false); // Đóng modal sau khi chọn
  };

  if (loading) {
    return <div className={styles.loading}>Đang tải địa chỉ...</div>;
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
          Chỉnh sửa
        </button>
      </div>

      {/* 👇 4. Render Modal chứa nội dung chỉnh sửa */}
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
// --- Component mới để chứa nội dung của Modal ---
const AddressModalContent = ({
  addresses,
  selectedAddress,
  onSelectAddress,
  onSaveNewAddress,
  onUpdateAddress,
  onClose,
}) => {
  const [view, setView] = useState("list"); // 'list', 'adding', 'editing'
  const [addressToEdit, setAddressToEdit] = useState(null);

  // Chuyển sang form chỉnh sửa
  const handleGoToEdit = (address) => {
    setAddressToEdit(address);
    setView("editing");
  };

  // Chuyển sang form thêm mới
  const handleGoToAdd = () => {
    console.log(
      "Nút 'Thêm địa chỉ mới' đã được nhấn! Chuẩn bị đổi view sang 'adding'..."
    );
    setAddressToEdit(null); // Đảm bảo không có dữ liệu cũ
    setView("adding");
  };

  // Xử lý lưu sau khi chỉnh sửa
  const handleSaveUpdate = (updatedData) => {
    onUpdateAddress(updatedData);
    setView("list"); // Quay lại danh sách sau khi lưu
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
