import React, { useState, useEffect } from "react";
import Modal from "../common/Modal";
import AddressEditView from "./AddressEditView";
import AddressForm from "./AddressForm";
import styles from "./DeliveryAddress.module.css";
import { useAuth } from "../../context/AuthContext";
import authService from "../../services/authService";
import { useToast } from "../../context/ToastContext";

const DeliveryAddress = ({ onAddressChange }) => {
  const { auth: currentUser } = useAuth();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);

  // [LOGIC MỚI] Khởi tạo từ LocalStorage nếu có
  const [selectedAddressId, setSelectedAddressId] = useState(() => {
    const savedId = localStorage.getItem("selected_address_id");
    return savedId ? Number(savedId) : null;
  });

  const [loading, setLoading] = useState(true);

  const mapTypeToGender = (type) => (type === "HOME" ? "MALE" : "FEMALE");
  const mapGenderToType = (gender) => (gender === "MALE" ? "HOME" : "WORK");

  // --- Load Address ---
  const fetchAddresses = async () => {
    if (currentUser && currentUser.id) {
      setLoading(true);
      try {
        const data = await authService.getUserInfos(currentUser.id);

        const mappedAddresses = data.map((item) => ({
          id: item.id,
          name: item.fullName,
          phone: item.phoneNumber,
          address: item.address,
          type: mapGenderToType(item.gender),
          isDefault: false,
        }));

        setAddresses(mappedAddresses);

        // [LOGIC MỚI] Xử lý chọn địa chỉ
        let idToSelect = selectedAddressId;

        // 1. Kiểm tra xem ID đang lưu có còn tồn tại trong danh sách mới không
        const isSavedIdValid = mappedAddresses.find((a) => a.id === idToSelect);

        if (!isSavedIdValid) {
          // 2. Nếu không tồn tại (hoặc chưa chọn), chọn cái đầu tiên
          if (mappedAddresses.length > 0) {
            idToSelect = mappedAddresses[0].id;
          } else {
            idToSelect = null;
          }
        }

        // 3. Cập nhật State và Storage
        setSelectedAddressId(idToSelect);
        if (idToSelect) {
          localStorage.setItem("selected_address_id", idToSelect);
        }
      } catch (error) {
        setAddresses([]);
      } finally {
        setLoading(false);
      }
    } else {
      setAddresses([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [currentUser]);

  const selectedAddress = addresses.find(
    (addr) => addr.id === selectedAddressId
  );

  useEffect(() => {
    if (onAddressChange) {
      // Truyền cả object ra ngoài cho Checkout dùng
      onAddressChange(selectedAddress || null);
    }
  }, [selectedAddress, onAddressChange]);

  // --- Handlers ---

  // [LOGIC MỚI] Chọn địa chỉ -> Lưu ID lại
  const handleSelectAddress = (id) => {
    setSelectedAddressId(id);
    localStorage.setItem("selected_address_id", id);
    setIsModalOpen(false);
  };

  const handleSaveNewAddress = async (newAddressData) => {
    try {
      const payload = {
        fullName: newAddressData.name,
        phoneNumber: newAddressData.phone,
        address: newAddressData.address,
        gender: mapTypeToGender(newAddressData.type),
      };
      await authService.createUserInfo(payload);
      await fetchAddresses();
      if (showToast)
        showToast({
          title: "Thành công",
          message: "Đã thêm địa chỉ mới",
          type: "success",
        });
      return true;
    } catch (error) {
      if (showToast)
        showToast({ title: "Lỗi", message: "Thêm thất bại", type: "error" });
      return false;
    }
  };

  const handleUpdateAddress = async (updatedAddressData) => {
    try {
      const payload = {
        fullName: updatedAddressData.name,
        phoneNumber: updatedAddressData.phone,
        address: updatedAddressData.address,
        gender: mapTypeToGender(updatedAddressData.type),
      };
      await authService.updateUserInfo(updatedAddressData.id, payload);
      await fetchAddresses();
      if (showToast)
        showToast({
          title: "Thành công",
          message: "Cập nhật thành công",
          type: "success",
        });
    } catch (error) {
      if (showToast)
        showToast({
          title: "Lỗi",
          message: "Cập nhật thất bại",
          type: "error",
        });
    }
  };

  // [MỚI] Hàm xóa địa chỉ
  const handleDeleteAddress = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa địa chỉ này?")) {
      try {
        await authService.deleteUserInfo(id);
        await fetchAddresses();
        if (showToast)
          showToast({
            title: "Thành công",
            message: "Đã xóa địa chỉ",
            type: "success",
          });
      } catch (error) {
        if (showToast)
          showToast({ title: "Lỗi", message: "Xóa thất bại", type: "error" });
      }
    }
  };

  // --- Render (Giữ nguyên UI) ---
  if (loading) return <div className={styles.loading}>Đang tải địa chỉ...</div>;

  if (!selectedAddress) {
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
            onDeleteAddress={handleDeleteAddress}
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
          onDeleteAddress={handleDeleteAddress}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

// Component con để quản lý view trong modal
const AddressModalContent = ({
  addresses,
  selectedAddress,
  onSelectAddress,
  onSaveNewAddress,
  onUpdateAddress,
  onDeleteAddress,
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

  const handleSaveUpdate = async (updatedData) => {
    await onUpdateAddress(updatedData);
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
      onDeleteAddress={onDeleteAddress} // Truyền hàm xóa xuống
      onCancel={onClose}
    />
  );
};

export default DeliveryAddress;
